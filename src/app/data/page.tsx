import { importAmuseCodes, importSafariBookmarks, importThatPitchPlacements, resetFromMaster } from "@/lib/actions";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function DataPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Data Management</h1>
      <p className="text-zinc-400">
        Loaded from OneDrive <code className="text-fuchsia-200">z_MASTER_RECORDS_V2_NEW_COVER copy.xlsx</code>.
        Full sheet dump: <code className="text-fuchsia-200">data/master-all-sheets.json</code>.
      </p>
      <Panel title="Imported into the prototype">
        <ul className="grid gap-2 sm:grid-cols-2 text-sm">
          <li>Radio stations: {store.radioStations.length}</li>
          <li>Supervisors: {store.supervisors.length}</li>
          <li>Opportunities: {store.opportunities.length}</li>
          <li>Spotify / playlist targets: {store.playlists.length}</li>
          <li>EDM blogs: {store.blogs.length}</li>
          <li>Libraries: {store.libraries.length}</li>
          <li>Placements: {store.placements.length}</li>
          <li>That Pitch rows: {store.placements.filter((item) => item.source === "that-pitch").length}</li>
          <li>Catalogue works: {store.tracks.length}</li>
          <li>PPC page views: {(store.ppcEvents ?? []).filter((item) => item.kind === "pageview").length}</li>
          <li>PPC clicks: {(store.ppcEvents ?? []).filter((item) => item.kind === "click").length}</li>
          <li>Popup leads: {(store.fanLeads ?? []).length}</li>
        </ul>
      </Panel>
      <Panel title="Amuse — ISRC & UPC">
        <p className="mb-3 text-sm text-zinc-400">
          Open{" "}
          <a className="text-fuchsia-300 underline" href="https://artist.amuse.io/studio/music/" target="_blank" rel="noreferrer">
            Amuse Studio → Music
          </a>
          , log in, then paste Title, ISRC, UPC and the pre-release / pre-save URL. Matching titles update the vault.
        </p>
        <form action={importAmuseCodes} className="grid gap-3">
          <textarea
            name="amuseTable"
            required
            rows={8}
            placeholder={"Title,Artist,ISRC,UPC,Pre-release link\nTrack name,DUTCHEYY,GBXXX1234567,5060123456789,https://pre.amuse.io/..."}
            className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-sm"
          />
          <button className="w-fit rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">
            Import Amuse codes
          </button>
        </form>
      </Panel>
      <Panel title="That Pitch — placements">
        <p className="mb-3 text-sm text-zinc-400">
          Copy the table from{" "}
          <a className="text-fuchsia-300 underline" href="https://app.thatpitch.com/dashboard" target="_blank" rel="noreferrer">
            app.thatpitch.com/dashboard
          </a>
          . Rows land on Sync Pipeline with source “that-pitch”.
        </p>
        <form action={importThatPitchPlacements} className="grid gap-3">
          <textarea
            name="thatPitchTable"
            required
            rows={8}
            placeholder={"Track,Artist,Library,Status,Date,Income\nSICK-live,DUTCHEYY,Epidemic,Accepted,2026-09-01,£0"}
            className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-sm"
          />
          <button className="w-fit rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">
            Import That Pitch placements
          </button>
        </form>
      </Panel>
      <Panel title="Safari Favourites — Spotify playlists">
        <p className="mb-3 text-sm text-zinc-400">
          macOS blocked Cursor from reading Safari&apos;s live bookmarks file. Export them yourself, then import
          here. In Safari: File → Export Bookmarks. Only Spotify playlists and free submit pages (SubmitHub,
          Groover, SubmitLink, PlaylistDock) are added.
        </p>
        <form action={importSafariBookmarks} className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            name="bookmarks"
            accept=".html,text/html"
            required
            className="text-sm"
          />
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">
            Import free Spotify playlists
          </button>
        </form>
      </Panel>
      <form action={resetFromMaster}>
        <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">
          Reset workspace from master import
        </button>
      </form>
    </div>
  );
}
