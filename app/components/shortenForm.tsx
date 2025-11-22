"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ShortenForm() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [shortCode, setShortCode] = useState<string>("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortCode("");

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url, 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setShortCode(data.code); 
    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="mb-4">
        <div className="space-y-4">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12"
            type="url"
            placeholder="enter url to shorten"
            required
          />

          <Button disabled={loading} className="w-full p-2" type="submit">
            {loading ? "Shortening..." : "Shorten"}
          </Button>
        </div>
      </form>

      
      {error && <p className="text-red-500">{error}</p>}

      {shortCode && (
        <p className="text-green-600">
          Short link:{" "}
          <a
            className="underline"
            href={`/${shortCode}`}
            target="_blank"
          >
            {window.location.origin}/{shortCode}
          </a>
        </p>
      )}
    </>
  );
}
