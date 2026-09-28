import { Panel } from "@/components/Ui";
import { submitVendorProduct } from "@/lib/actions";
import { productionCategories } from "@/lib/production-tools";
import { readSession } from "@/lib/session";
import { readStore } from "@/lib/store";

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ queued?: string }>;
}) {
  const { queued } = await searchParams;
  const session = await readSession();
  const store = await readStore();
  const mine = session
    ? (store.vendorProducts ?? []).filter(
        (item) => item.vendorEmail.toLowerCase() === session.email.toLowerCase(),
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">VENDORS</p>
        <h1 className="mt-1 text-3xl font-semibold">Upload a product</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Plugin makers, sample shops, and template sellers can submit a listing or file. It stays in a review
          queue until Dutcheyy Records approves it. Approved products show on the production suite.
        </p>
      </div>

      {queued ? (
        <p className="rounded-xl border border-fuchsia-400/40 bg-fuchsia-950/40 px-4 py-3 text-sm text-fuchsia-100">
          Received. Your product is pending approval and will not go live until it is reviewed.
        </p>
      ) : null}

      <Panel title="Vendor product">
        <form action={submitVendorProduct} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Vendor name
            <input
              name="vendorName"
              required
              defaultValue={session?.name || ""}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Vendor email
            <input
              name="vendorEmail"
              type="email"
              required
              defaultValue={session?.email || ""}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Product name
            <input
              name="productName"
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Category
            <select name="category" className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2">
              {productionCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="text-sm">
            Other category
            <input
              name="otherCategory"
              placeholder="Only if you picked Other"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Cost
            <input
              name="cost"
              placeholder="Free / Paid / Sub"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Product URL
            <input
              name="productUrl"
              type="url"
              placeholder="https://…"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            What it is
            <textarea
              name="description"
              rows={4}
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            File (optional, max 20MB)
            <input
              name="file"
              type="file"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-fuchsia-600 file:px-3 file:py-1 file:text-white"
            />
          </label>
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium hover:bg-fuchsia-500 md:col-span-2">
            Submit for approval
          </button>
        </form>
      </Panel>

      {mine.length ? (
        <Panel title="Your submissions">
          <ul className="space-y-3 text-sm">
            {mine.map((item) => (
              <li key={item.id} className="rounded-xl border border-white/10 p-3">
                <p className="font-medium">{item.productName}</p>
                <p className="text-zinc-400">
                  {item.status === "pending"
                    ? "Pending approval"
                    : item.status === "approved"
                      ? "Approved — live on Production suite"
                      : "Rejected"}
                  {item.reviewNote ? ` · ${item.reviewNote}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </div>
  );
}
