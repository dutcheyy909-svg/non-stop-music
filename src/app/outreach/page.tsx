import { DataTable, WebLink } from "@/components/DataTable";
import { PitchForm } from "@/components/PitchForm";
import { Panel } from "@/components/Ui";
import { draftRadioPitch, suggestStations } from "@/lib/engine";
import { readStore } from "@/lib/store";

export default async function OutreachPage() {
  const store = await readStore();
  const suggested = suggestStations(store);
  const top = suggested[0]?.station;
  const draft = top && store.tracks[0] ? draftRadioPitch(store, top.id, store.tracks[0].id) : "";
  const targets = [
    ...store.radioStations.map((s) => `Radio · ${s.name}`),
    ...store.playlists.map((p) => `Playlist · ${p.name}`),
  ];
  const withDirectContact = store.radioStations.filter((s) => s.email || s.phone || s.contact).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Outreach desk</h1>
        <p className="mt-2 text-zinc-400">
          {store.radioStations.length} radio stations from the master Radio Database. Email, phone, website and
          submission URL are mapped from the contact metadata columns ({withDirectContact} currently filled in the
          workbook — empty cells stay blank until you add them on the Radio Database sheet).
        </p>
      </div>
      <PitchForm tracks={store.tracks} targets={targets} channel="radio" defaultNotes={draft} />
      <Panel title="Radio contact metadata">
        <DataTable
          headers={["Station", "Country", "Email", "Phone", "Public contact", "Website", "Submission", "Research / source"]}
          rows={store.radioStations.map((s) => [
            s.name,
            s.country,
            s.email || "—",
            s.phone || "—",
            s.contact || "—",
            <WebLink key={`${s.id}-web`} href={s.website} />,
            <WebLink key={`${s.id}-sub`} href={s.submissionPage} />,
            <WebLink key={`${s.id}-src`} href={s.source} label="Open source" />,
          ])}
        />
      </Panel>
      <Panel title="Spotify / playlist pitch targets">
        <DataTable
          headers={["Name", "Country", "Status", "Submission", "Spotify", "Deep link"]}
          rows={store.playlists.map((p) => [
            p.name,
            p.country || "—",
            p.status,
            <WebLink key={`${p.id}-u`} href={p.url} />,
            <WebLink key={`${p.id}-s`} href={p.spotifyUrl} />,
            p.deepLink || "—",
          ])}
        />
      </Panel>
    </div>
  );
}
