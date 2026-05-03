"use client";

import { useState, useEffect } from "react";

export default function DisplayPage() {
  const [content, setContent] = useState<string | null>(null);
  const [background, setBackground] = useState("#000000");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "live") {
        setContent(event.data.content);
        setBackground(event.data.background || "#000000");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: background }}
    >
      {content ? (
        <div className="text-center text-white">
          <p className="text-4xl font-bold">{content}</p>
        </div>
      ) : (
        <div className="text-center text-zinc-600">
          <p className="text-2xl">Waiting for content...</p>
        </div>
      )}
    </div>
  );
}