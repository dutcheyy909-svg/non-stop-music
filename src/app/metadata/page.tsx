import { DataTable, WebLink } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { importAmuseCodes } from "@/lib/actions";
import { readStore } from "@/lib/store";

export default async function MetadataPage() {
  const store = await readStore();
  const missingIsrc = store.tracks.filter((t) => !t.isrc).length;
  const missingUpc = store.tracks.filter((t) => !t.upc).length;
  const missingPre = store.tracks.filter((t) => !t.preReleaseLink).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Metadata Centre</h1>
      <p className="text-zinc-400">
        {missingIsrc} works still need ISRC, {missingUpc} need UPC, and {missingPre} need a pre-release link. Generate
        supervisor copy on the{" "}
        <a className="text-fuchsia-300 underline" href="/sync-assistant">
          Sync assistant
        </a>
        . Catch playlist BPM/energy on the{" "}
        <a className="text-fuchsia-300 underline" href="/analyser">
          playlist analyser
        </a>
        . Amuse Studio is login-only, so paste from the studio after you sign in.
      </p>

      <Panel
        title="Connect Amuse — ISRC, UPC & pre-release"
        action={
          <a
            href="https://artist.amuse.io/studio/music/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500"
          >
            Open Amuse Studio
          </a>
        }
      >
        <p className="mb-3 text-sm text-zinc-400">
          From each release copy title, ISRC, UPC/barcode and the pre-release / pre-save URL. Paste a header row plus
          one row per track.
        </p>
        <form action={importAmuseCodes} className="grid gap-3">
          <textarea
            name="amuseTable"
            required
            rows={10}
            placeholder={
              "Title,Artist,ISRC,UPC,Pre-release link\nSICK-live,DUTCHEYY,GBXXX1234567,5060123456789,https://pre.amuse.io/..."
            }
            className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-sm"
          />
          <button className="w-fit rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">
            Import Amuse codes
          </button>
        </form>
      </Panel>

      <Panel title="Vault metadata health">
        <DataTable
          headers={["Title", "ISRC", "UPC", "Pre-release", "Writers", "Tags", "Rights"]}
          rows={store.tracks.map((t) => [
            t.title,
            t.isrc || "MISSING",
            t.upc || "MISSING",
            <WebLink key={`${t.id}-pre`} href={t.preReleaseLink} label="Open" />,
            t.writers,
            t.tags.join(" · "),
            t.rights,
          ])}
        />
      </Panel>
    </div>
  );
}
