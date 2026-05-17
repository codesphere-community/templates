from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import init_db


if __name__ == "__main__":
    init_db()
    print("Database initialized")
