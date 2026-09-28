import { DataTable, WebLink } from "@/components/DataTable";
import { PitchForm } from "@/components/PitchForm";
import { Panel } from "@/components/Ui";
import { draftRadioPitch, suggestStations } from "@/lib/engine";
import { readStore } from "@/lib/store";

export default async function RadioPage() {
  const store = await readStore();
  const suggested = suggestStations(store);
  const top = suggested[0]?.station;
  const draft = top && store.tracks[0] ? draftRadioPitch(store, top.id, store.tracks[0].id) : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Radio</h1>
        <p className="mt-2 text-zinc-400">
          {store.radioStations.length} stations imported from Radio Database. Contact columns are email, phone,
          website and the research URL from the master file.
        </p>
      </div>
      <PitchForm
        tracks={store.tracks}
        targets={store.radioStations.map((s) => s.name)}
        channel="radio"
        defaultNotes={draft}
      />
      <Panel title="Engine station suggestions">
        <DataTable
          headers={["Score", "Station", "Country", "Type"]}
          rows={suggested.map((row) => [
            row.score,
            row.station.name,
            row.station.country,
            row.station.stationType,
          ])}
        />
      </Panel>
      <Panel title="Full radio database">
        <DataTable
          headers={["Station", "Country", "Email", "Phone", "Website", "Source"]}
          rows={store.radioStations.map((s) => [
            s.name,
            s.country,
            s.email || s.contact || "—",
            s.phone || "—",
            <WebLink key={`${s.id}-w`} href={s.website || s.submissionPage} />,
            <WebLink key={`${s.id}-s`} href={s.source} label="Open" />,
          ])}
        />
      </Panel>
    </div>
  );
}
