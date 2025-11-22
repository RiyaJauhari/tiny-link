import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  const code = await params.code;

  const result = await db.query(
    "SELECT code, url, clicks, last_clicked, created_at FROM links WHERE code=$1",
    [code]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ code: string }> }
) {
  const { code } = await props.params;   

  console.log("DELETE ROUTE HIT!", code);

  const result = await db.query("DELETE FROM links WHERE code=$1", [code]);

  console.log("DELETE RESULT:", result.rowCount);

  return NextResponse.json({ ok: true });
}

