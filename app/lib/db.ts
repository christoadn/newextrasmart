import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "127.0.0.1",
  port: 3306, // harus sama
  user: "root",
  password: "",
  database: "db_new_extra_smart",
});