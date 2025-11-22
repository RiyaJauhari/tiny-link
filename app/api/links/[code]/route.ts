import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/links/[code]
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } } // params is NOT a Promise
) {
  const code = params.code; // no await

  try {
    const result = await db.query(
      "SELECT code, url, clicks, last_clicked, created_at FROM links WHERE code=$1",
      [code]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/links/[code]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code; // no await

  try {
    const result = await db.query("DELETE FROM links WHERE code=$1", [code]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
