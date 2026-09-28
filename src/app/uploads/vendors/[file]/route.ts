import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  if (!file || file.includes("..") || file.includes("/") || file.includes("\\")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    const abs = path.join(process.cwd(), "uploads", "vendors", file);
    const data = await readFile(abs);
    return new NextResponse(data, {
      headers: { "Content-Type": "application/octet-stream", "Content-Disposition": `attachment; filename="${file}"` },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
}
