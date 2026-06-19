import sqlite3\nconn = sqlite3.connect('blogposts.db')\nc = conn.cursor()\nc.execute("SELECT * FROM keywords")\nprint(c.fetchall())\nconn.close()
