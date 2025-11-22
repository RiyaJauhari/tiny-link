import { redirect } from "next/navigation";
import db from "@/lib/db";

export default async function RedirectPage(props: { params: Promise<{ code: string }> }) {
  const { code } = await props.params; // 👈 IMPORTANT FIX

  console.log("Redirecting code:", code);

  const result = await db.query(
    "SELECT url, clicks FROM links WHERE code=$1",
    [code]
  );

  console.log("DB result:", result.rows);

  if (result.rows.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">404 – Short link not found</h1>
      </div>
    );
  }

  const url = result.rows[0].url;

  await db.query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1",
    [code]
  );

  redirect(url);
}
