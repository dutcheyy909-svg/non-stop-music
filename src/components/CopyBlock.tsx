"use client";

import { useState } from "react";

export function CopyBlock({ text, filename }: { text: string; filename: string }) {
  const [copied, setCopied] = useState(false);
  const href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        className="rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm font-medium hover:bg-fuchsia-500"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <a href={href} download={filename} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm">
        Download
      </a>
    </div>
  );
}
