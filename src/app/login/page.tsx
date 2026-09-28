import { loginUser } from "@/lib/actions";
import { readSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Panel } from "@/components/Ui";

export default async function LoginPage() {
  const session = await readSession();
  if (session) redirect("/deals");

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">ACCOUNT</p>
        <h1 className="mt-1 text-3xl font-semibold">Log in</h1>
        <p className="mt-2 text-zinc-400">
          After you sign in you go straight to <strong>Promotion package deals</strong> — Radio, Spotify submissions,
          and Blogs. All other tabs stay in the menu.
        </p>
      </div>
      <Panel title="Continue">
        <form action={loginUser} className="grid gap-3">
          <label className="text-sm">
            Name
            <input name="name" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2" />
          </label>
          <label className="text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2"
            />
          </label>
          <button className="rounded-lg bg-fuchsia-600 px-4 py-2 font-medium hover:bg-fuchsia-500">
            Log in → package deals
          </button>
        </form>
      </Panel>
    </div>
  );
}
