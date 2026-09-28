import type { ReactNode } from "react";

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<ReactNode>>;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-fuchsia-950/50 text-fuchsia-100">
          <tr>
            {headers.map((header) => (
              <th key={header} className="whitespace-nowrap px-3 py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-white/10 odd:bg-white/2">
              {row.map((cell, j) => (
                <td key={j} className="max-w-[280px] truncate px-3 py-2 text-zinc-200">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WebLink({ href, label }: { href?: string; label?: string }) {
  if (!href) return <span className="text-zinc-500">—</span>;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-fuchsia-300 underline decoration-fuchsia-500/40">
      {label || href.replace(/^https?:\/\//, "").slice(0, 42)}
    </a>
  );
}
