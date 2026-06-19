import sqlite3\nconn = sqlite3.connect('blogposts.db')\nc = conn.cursor()\nc.execute("INSERT INTO blogposts (content) VALUES ('This is a sample blog post content.')")\nconn.commit()\nconn.close()
