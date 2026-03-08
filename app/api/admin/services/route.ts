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
    const [rows] = await connection.execute("SELECT * FROM services ORDER BY id ASC");
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  let connection;
  try {
    const { services, deletedIds } = await req.json();
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // 1. Handle Deletions
    if (deletedIds && deletedIds.length > 0) {
      await connection.query("DELETE FROM services WHERE id IN (?)", [deletedIds]);
    }

    // 2. Handle Upserts (Insert new or Update existing)
    for (const s of services) {
      const isNew = typeof s.id === "string" && s.id.startsWith("new-");
      
      if (isNew) {
        await connection.execute(
          "INSERT INTO services (title, `desc`, icon_name) VALUES (?, ?, ?)",
          [s.title, s.desc, s.icon_name]
        );
      } else {
        await connection.execute(
          "UPDATE services SET title = ?, `desc` = ?, icon_name = ? WHERE id = ?",
          [s.title, s.desc, s.icon_name, s.id]
        );
      }
    }

    await connection.commit();
    await connection.end();
    return NextResponse.json({ message: "Success" });
  } catch (error: any) {
    if (connection) await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}