"use client";

import { useState } from "react";

export default function PreviewPage() {
  const [panelFrame, setPanelFrame] = useState<string | null>(null);

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <h1 className="text-lg font-semibold text-zinc-50">Preview</h1>
      </header>
      <div className="flex flex-1">
        <iframe
          src="/panel"
          className="flex-1 border-r border-zinc-800"
        />
      </div>
    </div>
  );
}