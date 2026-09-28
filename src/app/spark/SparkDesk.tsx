"use client";

import { logPpcEvent } from "@/lib/actions";
import type { SparkTool } from "@/lib/spark-tools";

export function SparkDesk({
  tool,
  src,
  page = "/spark",
}: {
  tool: SparkTool;
  src?: string;
  page?: string;
}) {
  const href = src || tool.url;
  function logOpen() {
    const data = new FormData();
    data.set("kind", "click");
    data.set("page", page);
    data.set("href", href);
    data.set("label", tool.name);
    void logPpcEvent(data);
  }

  return (
    <div className="space-y-3">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={logOpen}
        className="inline-flex rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500"
      >
        {tool.cta}
      </a>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <iframe title={tool.name} src={href} className="h-[640px] w-full bg-black" />
      </div>
    </div>
  );
}
