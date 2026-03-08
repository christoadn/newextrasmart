import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(path.join(uploadsDir, fileName), Buffer.from(arrayBuffer));

  const url = `/uploads/${fileName}`;
  return NextResponse.json({ url });
};