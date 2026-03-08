import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "db_new_extra_smart",
};

// GET: Mengambil semua daftar partner
export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows]: any = await connection.execute("SELECT * FROM partners ORDER BY id ASC");
    await connection.end();
    
    return NextResponse.json({ partners: rows });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Gagal memuat data partners" }, { status: 500 });
  }
}

// POST: Menyimpan/Update semua daftar partner
export async function POST(req: Request) {
  let connection;
  try {
    const body = await req.json();
    const { partners } = body; // Mengharapkan array of objects { name, image_url }

    connection = await mysql.createConnection(dbConfig);
    
    // Mulai Transaksi agar data konsisten
    await connection.beginTransaction();

    // 1. Hapus semua data lama (karena admin bisa menambah/menghapus urutan)
    await connection.execute("DELETE FROM partners");

    // 2. Insert data baru jika ada
    if (partners && partners.length > 0) {
      const values = partners.map((p: any) => [p.name, p.image_url]);
      const sql = "INSERT INTO partners (name, image_url) VALUES ?";
      
      // mysql2 menggunakan format [ [val1, val2], [val1, val2] ] untuk bulk insert
      await connection.query(sql, [values]);
    }

    await connection.commit();
    await connection.end();

    return NextResponse.json({ message: "Partners berhasil diperbarui" });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Save Error:", error);
    return NextResponse.json({ message: "Gagal menyimpan data partners" }, { status: 500 });
  }
}