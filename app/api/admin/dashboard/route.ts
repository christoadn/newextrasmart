import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // isi sesuai DB
  database: "db_new_extra_smart",
});

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export async function GET() {
  const [rows] = await db.query("SELECT * FROM team_members ORDER BY id ASC");
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const team: any[] = await req.json();

  // replace all team members (simple way)
  await db.query("DELETE FROM team_members");
  for (const m of team) {
    await db.query(
      "INSERT INTO team_members (id, name, role, desc, color, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [m.id, m.name, m.role, m.desc, m.color, m.image_url]
    );
  }

  return NextResponse.json({ success: true });
}

// optional: simple file upload API
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as unknown as File;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${fileName}` });
}