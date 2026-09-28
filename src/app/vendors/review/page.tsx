import { DataTable, WebLink } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import { reviewVendorProduct } from "@/lib/actions";
import { readStore } from "@/lib/store";
import type { VendorProduct } from "@/lib/types";

function ReviewRow({ item }: { item: VendorProduct }) {
  return (
    <article className="rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-fuchsia-300">{item.category}</p>
          <h3 className="mt-1 text-lg font-semibold">{item.productName}</h3>
          <p className="text-sm text-zinc-400">
            {item.vendorName} · {item.vendorEmail} · {item.cost || "Cost not listed"}
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-fuchsia-200">{item.status}</p>
      </div>
      <p className="mt-3 text-sm text-zinc-300">{item.description}</p>
      <p className="mt-2 text-xs text-zinc-500">
        {item.productUrl ? <WebLink href={item.productUrl} label="Vendor site" /> : "No URL"}
        {item.filePath ? (
          <>
            {" · "}
            <a className="text-fuchsia-300 underline" href={item.filePath}>
              {item.fileName || "Download file"}
            </a>
          </>
        ) : null}
      </p>
      {item.status === "pending" ? (
        <form action={reviewVendorProduct} className="mt-4 grid gap-2 md:grid-cols-[1fr_auto_auto]">
          <input type="hidden" name="id" value={item.id} />
          <input
            name="reviewNote"
            placeholder="Note to the vendor (optional)"
            className="rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm"
          />
          <button
            name="decision"
            value="approved"
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500"
          >
            Approve
          </button>
          <button
            name="decision"
            value="rejected"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm"
          >
            Reject
          </button>
        </form>
      ) : item.reviewNote ? (
        <p className="mt-3 text-sm text-zinc-400">Note: {item.reviewNote}</p>
      ) : null}
    </article>
  );
}

export default async function VendorReviewPage() {
  const store = await readStore();
  const products = store.vendorProducts ?? [];
  const pending = products.filter((item) => item.status === "pending");
  const approved = products.filter((item) => item.status === "approved");
  const rejected = products.filter((item) => item.status === "rejected");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">A&R</p>
        <h1 className="mt-1 text-3xl font-semibold">Vendor approvals</h1>
        <p className="mt-2 text-zinc-400">
          Pending listings stay off the production suite until you approve them.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Pending" value={pending.length} />
        <Kpi label="Approved" value={approved.length} />
        <Kpi label="Rejected" value={rejected.length} />
      </div>
      <Panel title="Queue">
        {pending.length ? (
          <div className="space-y-3">
            {pending.map((item) => (
              <ReviewRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-400">No products waiting.</p>
        )}
      </Panel>
      <Panel title="Approved (live)">
        <DataTable
          headers={["Product", "Vendor", "Category", "Cost", "Reviewed"]}
          rows={approved.map((item) => [
            item.productName,
            item.vendorName,
            item.category,
            item.cost,
            item.reviewedAt.slice(0, 10),
          ])}
        />
      </Panel>
      {rejected.length ? (
        <Panel title="Rejected">
          <div className="space-y-3">
            {rejected.map((item) => (
              <ReviewRow key={item.id} item={item} />
            ))}
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
