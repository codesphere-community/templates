import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const id = req.body.id;
    const column = req.body.column;
    

    const db = await open({
      filename: "./roadmap.db",
      driver: sqlite3.Database,
    });

    const statement = await db.prepare(
      `UPDATE roadmap SET ${column} = ${column} +1 WHERE id = ${id}`
    );
    await statement.run();
    await statement.finalize();

    const updatedItem = await db.get("SELECT * FROM roadmap WHERE id = ?", id);

    res.status(200).json({ id: updatedItem.id, upvotes: updatedItem.upvotes, fires: updatedItem.fires, hearts: updatedItem.hearts });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
