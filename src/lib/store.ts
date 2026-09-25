import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { seededStore } from "./seed";
import { runMonitor } from "./engine";
import type { Store } from "./types";

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "store.json");

export async function readStore(): Promise<Store> {
  try {
    const text = await readFile(storePath, "utf8");
    const parsed = JSON.parse(text) as Store;
    if (!parsed.radioStations?.length) {
      const fresh = runMonitor(seededStore);
      await writeStore(fresh);
      return fresh;
    }
    return parsed;
  } catch {
    const fresh = runMonitor(seededStore);
    await writeStore(fresh);
    return fresh;
  }
}

export async function writeStore(store: Store) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

export async function updateStore(mutator: (store: Store) => Store) {
  const current = await readStore();
  const next = runMonitor(mutator(current));
  await writeStore(next);
  return next;
}
