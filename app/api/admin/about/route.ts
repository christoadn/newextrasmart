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
    const [rows]: any = await connection.execute("SELECT * FROM about_section WHERE id = 1");
    await connection.end();

    return NextResponse.json({ content: rows[0] || null });
  } catch (error) {
    return NextResponse.json({ message: "Gagal memuat data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, vision, mission, image_url, vision_url, mission_url } = body;
    const connection = await mysql.createConnection(dbConfig);

    const sql = `
      INSERT INTO about_section (id, title, content, vision, mission, image_url, vision_url, mission_url)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      title = VALUES(title), 
      content = VALUES(content), 
      vision = VALUES(vision), 
      mission = VALUES(mission), 
      image_url = VALUES(image_url),
      vision_url = VALUES(vision_url),
      mission_url = VALUES(mission_url)
    `;

    await connection.execute(sql, [
        title, 
        content, 
        vision, 
        mission, 
        image_url || null, 
        vision_url || null, 
        mission_url || null
    ]);
    
    await connection.end();
    return NextResponse.json({ message: "Berhasil diperbarui" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Gagal menyimpan" }, { status: 500 });
  }
}