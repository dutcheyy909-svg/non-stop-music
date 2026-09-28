import { DealTabs } from "@/components/DealTabs";
import { DataTable } from "@/components/DataTable";
import { Kpi, Panel } from "@/components/Ui";
import { gbp } from "@/lib/dutcheyy-radio";
import { promoPackages } from "@/lib/promo-packages";
import { readSession } from "@/lib/session";
import { readStore } from "@/lib/store";
import Link from "next/link";

export default async function DealsPage() {
  const session = await readSession();
  const store = await readStore();
  const orders = (store.promoOrders ?? []).filter((order) => !session || order.email === session.email);
  const total = orders.reduce((sum, order) => sum + order.amountGbp, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">PROMOTION</p>
        <h1 className="mt-1 text-3xl font-semibold">Package deals</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Radio, Spotify submissions, and blogs on one page with every tab visible. Sign in and you are brought here.
          Booking logs the pack against your email — card checkout can sit on top later.
        </p>
        {!session ? (
          <p className="mt-2 text-sm">
            <Link href="/login" className="text-fuchsia-300 underline">
              Log in
            </Link>{" "}
            to book. Guests can still open every tab and every desk.
          </p>
        ) : (
          <p className="mt-2 text-sm text-fuchsia-200">Signed in as {session.name} · {session.email}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Packs on the board" value={promoPackages.length} />
        <Kpi label="Your bookings" value={session ? orders.length : "—"} />
        <Kpi label="Booked value" value={session ? gbp(total) : "—"} />
      </div>

      <Panel title="Choose a tab">
        <DealTabs loggedIn={Boolean(session)} />
      </Panel>

      {session ? (
        <Panel title="Your bookings">
          <DataTable
            headers={["When", "Pack", "Tab", "Amount"]}
            rows={orders.map((order) => [
              order.createdAt.slice(0, 16).replace("T", " "),
              order.packageName,
              order.tab,
              gbp(order.amountGbp),
            ])}
          />
        </Panel>
      ) : null}
    </div>
  );
}
