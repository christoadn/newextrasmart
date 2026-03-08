import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "db_new_extra_smart",
  // Tambahkan koneksi timeout agar tidak mudah putus saat kirim gambar
  connectTimeout: 20000, 
};

export async function POST(req: Request) {
  let connection;
  try {
    const items = await req.json();
    connection = await mysql.createConnection(dbConfig);
    
    // MULAI TRANSAKSI
    await connection.beginTransaction();

    try {
      // 1. Hapus data lama
      await connection.execute("DELETE FROM gallery");

      // 2. Insert data satu per satu
      if (items && items.length > 0) {
        for (const item of items) {
          // Proteksi ekstra: Pastikan hanya 10 gambar yang masuk ke DB
          const limitedImages = Array.isArray(item.images) ? item.images.slice(0, 10) : [];
          
          await connection.execute(
            "INSERT INTO gallery (title, category, cover, images) VALUES (?, ?, ?, ?)",
            [
              item.title || "Untitled Event",
              item.category || "General",
              item.cover || "",
              JSON.stringify(limitedImages),
            ]
          );
        }
      }

      // JIKA SEMUA BERHASIL, SIMPAN PERUBAHAN
      await connection.commit();
      return NextResponse.json({ success: true });

    } catch (innerError: any) {
      // JIKA ADA ERROR, BATALKAN SEMUA (Data lama tidak jadi hilang)
      await connection.rollback();
      throw innerError;
    }

  } catch (error: any) {
    console.error("DATABASE_ERROR:", error.message);
    return NextResponse.json({ 
      error: "Gagal sinkronisasi database: " + error.message 
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    // Tambahkan pengurutan ID agar urutan di editor dan public konsisten
    const [rows]: any = await connection.execute("SELECT * FROM gallery ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}