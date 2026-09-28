import { DataTable, WebLink } from "@/components/DataTable";
import { Panel } from "@/components/Ui";
import { publicWebUrl } from "@/lib/blog-urls";
import { readStore } from "@/lib/store";

export default async function BlogsPage() {
  const store = await readStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">EDM Blog Contacts</h1>
      <p className="text-zinc-400">
        {store.blogs.length} outlets from the master workbook. Links are opened as HTTPS; Resident Advisor now goes to
        ra.co and DJ Mag to djmag.com. Many older EDM blogs on the sheet are dead, parked, or hijacked — confirm before
        you pitch.
      </p>
      <Panel title="Contacts">
        <DataTable
          headers={["Blog", "Email", "Location", "Genre", "Website"]}
          rows={store.blogs.map((b) => [
            b.name,
            b.email || "—",
            b.location || "—",
            b.genre,
            <WebLink key={b.id} href={publicWebUrl(b.website) || undefined} />,
          ])}
        />
      </Panel>
    </div>
  );
}
