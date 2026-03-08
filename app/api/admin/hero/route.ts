import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "db_new_extra_smart",
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows]: any = await connection.execute("SELECT * FROM hero_section WHERE id = 1");
    await connection.end();
    return NextResponse.json({ content: rows[0] || null });
  } catch (error) {
    return NextResponse.json({ message: "Gagal memuat data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, image_url } = body;
    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      INSERT INTO hero_section (id, title, subtitle, image_url)
      VALUES (1, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      title = VALUES(title), 
      subtitle = VALUES(subtitle), 
      image_url = VALUES(image_url)
    `;

    await connection.execute(sql, [title, subtitle, image_url]);
    await connection.end();

    return NextResponse.json({ message: "Berhasil diperbarui" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menyimpan" }, { status: 500 });
  }
}