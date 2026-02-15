import { Pool } from "pg";
import { DATABASE_URL } from "./config/env.js";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

// pool.on("connect", () => {
//   console.log("Conectado ao PostgreSQL!");
// });

// pool.on("error", (err) => {
//   console.error("Erro na pool do PostgreSQL:", err);
// });

export default pool;