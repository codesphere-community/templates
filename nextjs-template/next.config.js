const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  async db() {
    return {
      filename: "./roadmap.db",
      driver: sqlite3.Database,
    };
  },
  async onStartup() {
    const db = await sqlite.open({
      filename: "./roadmap.db",
      driver: sqlite3.Database,
    });

    await db.exec();
  },
};
