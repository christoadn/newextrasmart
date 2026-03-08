import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Konfigurasi Database
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_new_extra_smart",
};

/**
 * GET: Mengambil semua data anggota tim dari tabel team_members
 */
export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Ambil semua data team_members
    const [rows] = await connection.execute(
      "SELECT id, name, role, `desc`, color, image_url FROM team_members ORDER BY id ASC"
    );

    await connection.end();

    // Mengembalikan data sebagai array
    return NextResponse.json(rows || []);
  } catch (error: any) {
    console.error("Team Fetch Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data team members" },
      { status: 500 }
    );
  }
}
