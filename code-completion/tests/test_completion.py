import json
import os
import unittest

from completion import build_prompt, request_completion


class FakeResponse:
    def __init__(self, value):
        self.value = value

    def read(self):
        return json.dumps(self.value).encode("utf-8")


class CompletionTests(unittest.TestCase):
    def test_prompt_contains_language_and_cursor_sections(self):
        prompt = build_prompt("print(", ")", "Python")
        self.assertIn("Language: Python", prompt)
        self.assertIn("<prefix>\nprint(\n</prefix>", prompt)
        self.assertIn("<suffix>\n)\n</suffix>", prompt)

    def test_request_supports_openai_text_response(self):
        captured = {}

        def opener(request, timeout):
            captured["url"] = request.full_url
            captured["timeout"] = timeout
            captured["body"] = json.loads(request.data.decode("utf-8"))
            return FakeResponse({"choices": [{"text": "value"}]})

        old = os.environ.get("MODEL_BASE_URL")
        os.environ["MODEL_BASE_URL"] = "http://model:8080/v1"
        try:
            self.assertEqual(request_completion("x = ", "", "Python", opener=opener), "value")
        finally:
            if old is None:
                os.environ.pop("MODEL_BASE_URL", None)
            else:
                os.environ["MODEL_BASE_URL"] = old
        self.assertEqual(captured["url"], "http://model:8080/v1/completions")
        self.assertEqual(captured["timeout"], 30)
        self.assertEqual(captured["body"]["temperature"], 0.1)

    def test_request_supports_chat_message_response(self):
        result = request_completion(
            "const x = ",
            "",
            "JavaScript",
            opener=lambda *_, **__: FakeResponse({"choices": [{"message": {"content": "1"}}]}),
        )
        self.assertEqual(result, "1")


if __name__ == "__main__":
    unittest.main()
