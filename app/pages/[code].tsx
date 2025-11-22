
"use client"
import { GetServerSideProps } from "next";
import db from "../../lib/db";

export default function RedirectPage() {
  return null; 
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = params?.code as string;

  const result = await db.query("SELECT url FROM links WHERE code=$1", [code]);

  if (result.rows.length === 0) {
    return { notFound: true };
  }

  const longUrl = result.rows[0].url;

  await db.query(
    "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1",
    [code]
  );

  return {
    redirect: {
      destination: longUrl,
      permanent: false,
    },
  };
};
