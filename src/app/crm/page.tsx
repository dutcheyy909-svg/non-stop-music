import { DataTable } from "@/components/DataTable";
import { PitchForm } from "@/components/PitchForm";
import { Panel } from "@/components/Ui";
import { readStore } from "@/lib/store";

export default async function CrmPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">CRM</h1>
      <p className="text-zinc-400">
        Supervisors and radio contacts from the same master file — {store.supervisors.length} supervisors,{" "}
        {store.radioStations.length} stations.
      </p>
      <PitchForm
        tracks={store.tracks}
        targets={[
          ...store.supervisors.map((s) => `Supervisor · ${s.name}`),
          ...store.radioStations.slice(0, 80).map((s) => `Radio · ${s.name}`),
        ]}
        channel="licensing"
        defaultNotes="Merged CRM pitch. EPK + selected catalogue."
      />
      <Panel title="Supervisors">
        <DataTable
          headers={["Priority", "Name", "Org", "Region", "Contact / route", "Status"]}
          rows={store.supervisors.map((s) => [
            s.priority,
            s.name,
            s.organisation,
            s.region,
            s.contact,
            s.status,
          ])}
        />
      </Panel>
      <Panel title="Radio contacts">
        <DataTable
          headers={["Station", "Country", "Type", "Contact"]}
          rows={store.radioStations.slice(0, 40).map((s) => [
            s.name,
            s.country,
            s.stationType,
            s.contact || "—",
          ])}
        />
      </Panel>
    </div>
  );
}
