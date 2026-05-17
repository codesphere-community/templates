from __future__ import annotations

import argparse
import json
import math
import re
import tempfile
import time
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

import apache_beam as beam

from app import database

TOKEN_RE = re.compile(r"[a-zA-Z][a-zA-Z0-9-]{2,}")
STOPWORDS = {
    "about",
    "after",
    "also",
    "and",
    "are",
    "because",
    "but",
    "can",
    "for",
    "from",
    "has",
    "have",
    "into",
    "its",
    "more",
    "not",
    "that",
    "the",
    "their",
    "this",
    "with",
    "your",
}


@dataclass(frozen=True)
class BlogPost:
    slug: str
    title: str
    body: str


def tokenize(text: str) -> list[str]:
    return [
        token.lower()
        for token in TOKEN_RE.findall(text)
        if token.lower() not in STOPWORDS
    ]


def compute_tfidf(posts: list[BlogPost], limit: int = 8) -> list[dict]:
    if not posts:
        return []

    document_count = len(posts)
    term_counts = {post.slug: Counter(tokenize(f"{post.title} {post.body}")) for post in posts}
    document_frequency: Counter[str] = Counter()
    for counts in term_counts.values():
        document_frequency.update(counts.keys())

    results: list[dict] = []
    for post in posts:
        counts = term_counts[post.slug]
        total_terms = sum(counts.values()) or 1
        scored_terms = []
        for term, count in counts.items():
            term_frequency = count / total_terms
            inverse_document_frequency = math.log((1 + document_count) / (1 + document_frequency[term])) + 1
            scored_terms.append((term, round(term_frequency * inverse_document_frequency, 6)))

        for keyword, score in sorted(scored_terms, key=lambda item: (-item[1], item[0]))[:limit]:
            results.append({"slug": post.slug, "keyword": keyword, "score": score})
    return results


class ComputeKeywords(beam.DoFn):
    def process(self, posts: list[dict]):
        blog_posts = [BlogPost(slug=row["slug"], title=row["title"], body=row["body"]) for row in posts]
        yield from compute_tfidf(blog_posts)


def run_pipeline() -> int:
    posts = database.list_posts()
    if not posts:
        return 0

    with tempfile.TemporaryDirectory() as temp_dir:
        output_prefix = str(Path(temp_dir) / "keywords")
        output_file = Path(f"{output_prefix}.jsonl")
        with beam.Pipeline() as pipeline:
            (
                pipeline
                | "CreateCorpus" >> beam.Create([posts])
                | "ComputeKeywords" >> beam.ParDo(ComputeKeywords())
                | "SerializeKeywords" >> beam.Map(json.dumps)
                | "WriteKeywordRows"
                >> beam.io.WriteToText(
                    output_prefix,
                    file_name_suffix=".jsonl",
                    shard_name_template="",
                )
            )

        output = [json.loads(line) for line in output_file.read_text(encoding="utf-8").splitlines()]

    database.replace_keywords(output)
    return len(output)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the Beam TF-IDF keyword pipeline.")
    parser.add_argument("--once", action="store_true", help="Process the current corpus once.")
    parser.add_argument("--watch", action="store_true", help="Process repeatedly for near-real-time ingestion.")
    parser.add_argument("--interval", type=int, default=15, help="Watch interval in seconds.")
    args = parser.parse_args()

    database.init_db()
    if args.watch:
        while True:
            count = run_pipeline()
            print(f"Updated {count} keyword rows")
            time.sleep(args.interval)
    else:
        count = run_pipeline()
        print(f"Updated {count} keyword rows")


if __name__ == "__main__":
    main()
