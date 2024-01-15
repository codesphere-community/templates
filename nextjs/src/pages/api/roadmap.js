import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await open({
      filename: "./roadmap.db",
      driver: sqlite3.Database,
    });
    await db.all(
      `
      CREATE TABLE IF NOT EXISTS roadmap (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        month TEXT NOT NULL,
        upvotes INT NOT NULL DEFAULT 0,
        fires INT NOT NULL DEFAULT 0,
        hearts INT NOT NULL DEFAULT 0
      );
      `
    );      


    const roadmapItems = await db.all("SELECT * FROM roadmap WHERE status = 'planned'");
    const shippedItems = await db.all("SELECT * FROM roadmap WHERE status = 'released'");
    

    res.status(200).json({'roadmapItems': roadmapItems, 'shippedItems': shippedItems});
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}


