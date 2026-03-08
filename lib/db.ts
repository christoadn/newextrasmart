import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhosttt",
  user: "root",
  password: "", 
  database: "db_new_extra_smart",
});

// Pastikan export diletakkan di akhir atau langsung di baris deklarasi
export { db };