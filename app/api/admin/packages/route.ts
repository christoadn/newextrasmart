import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "db_new_extra_smart",
};

export async function POST(req: Request) {
  let connection;
  try {
    const { packages, intro } = await req.json();

    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // 1. UPDATE INTRO SECTION (Tabel site_settings)
    await connection.execute(
      "UPDATE site_settings SET content_title = ?, content_text = ? WHERE id = 'services_intro'",
      [intro.title || "", intro.text || ""]
    );

    // 2. REFRESH PACKAGES (Tabel package_services)
    await connection.execute("DELETE FROM package_services");
    
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      await connection.execute(
        "INSERT INTO package_services (title, category, items, image_url, order_index) VALUES (?, ?, ?, ?, ?)",
        [
          pkg.title || "Untitled Package",
          pkg.category || "General",
          JSON.stringify(pkg.items || []),
          pkg.image_url || null,
          i
        ]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error("Database Error:", error.message);
    return NextResponse.json(
      { error: "Gagal simpan: " + error.message }, 
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Ambil Data Paket
    const [rows]: any = await connection.execute("SELECT * FROM package_services ORDER BY order_index ASC");
    
    // Ambil Data Intro
    const [introRow]: any = await connection.execute("SELECT * FROM site_settings WHERE id = 'services_intro'");
    
    const formattedPackages = rows.map((r: any) => ({
      ...r,
      items: r.items ? JSON.parse(r.items) : []
    }));

    return NextResponse.json({
      packages: formattedPackages,
      intro: introRow[0] || { content_title: "", content_text: "" }
    });
  } catch (error: any) {
    return NextResponse.json({ packages: [], intro: {} }, { status: 200 });
  } finally {
    if (connection) await connection.end();
  }
}