import "@/styles/globals.css";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export async function getServerSideProps() {
  const db = await open({
    filename: "./roadmap.db",
    driver: sqlite3.Database,
  });

  return {
    props: {
      db,
    },
  };
}
