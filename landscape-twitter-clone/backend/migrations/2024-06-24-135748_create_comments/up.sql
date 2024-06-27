CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    tweetId INTEGER,
    comment TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users (id)
    FOREIGN KEY (tweetId) REFERENCES tweets (id)
);
