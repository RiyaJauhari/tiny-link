import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { isValidLongUrl, isValidCode, generateCode } from "../../../lib/validators";




export async function GET() {
  const { rows } = await db.query(
    "SELECT code, url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC"
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { url, code: customCode } = body;

  if (!url || !isValidLongUrl(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  let shortcode = customCode;

  if (shortcode) {
    if (!isValidCode(shortcode)) {
      return NextResponse.json(
        { error: "Code must match pattern [A-Za-z0-9]{6,8}" },
        { status: 400 }
      );
    }

    const exists = await db.query(
      "SELECT code FROM links WHERE code=$1",
      [shortcode]
    );

    if (exists.rows.length > 0) {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }
  } else {
    shortcode = generateCode(6);
  }

  await db.query(
    "INSERT INTO links(code, url) VALUES($1, $2)",
    [shortcode, url]
  );
  console.log("Saved shortcode:", shortcode);

  return NextResponse.json({ code: shortcode, url }, { status: 201 });
}

