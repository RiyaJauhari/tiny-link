import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/links/[code]
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> } // Next 15 requires Promise
) => {
  const { code } = await params; // await the Promise

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
};

// DELETE /api/links/[code]
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) => {
  const { code } = await params;

  try {
    const result = await db.query("DELETE FROM links WHERE code=$1", [code]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
