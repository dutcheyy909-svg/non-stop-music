import Link from "next/link";
import { PpcLink, PpcPageHit } from "@/components/PpcLink";
import { Panel } from "@/components/Ui";
import { sparkAtlasUrl, sparkSuiteName, sparkTools } from "@/lib/spark-tools";
import { readStore } from "@/lib/store";
import { SparkDesk } from "./SparkDesk";

export default async function SparkPage() {
  const store = await readStore();
  const lists = sparkTools.find((item) => item.id === "spark-lists")!;
  const atlas = sparkTools.find((item) => item.id === "spark-atlas")!;
  const rest = sparkTools.filter((item) => item.id !== "spark-lists" && item.id !== "spark-atlas");
  const artists = [...new Set(store.tracks.map((track) => track.artist).filter(Boolean))].slice(0, 12);

  return (
    <div className="space-y-6">
      <PpcPageHit page="/spark" />
      <div>
        <p className="text-xs tracking-[0.25em] text-fuchsia-300">AI TOOLS</p>
        <h1 className="mt-1 text-3xl font-semibold">{sparkSuiteName}</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          Playlist research and artist neighbourhoods for the vault. Spark Lists builds related playlists from a seed
          track. Spark Atlas maps who sits next to an artist. Use the output on{" "}
          <Link href="/promote" className="text-fuchsia-300 underline">
            Promotion
          </Link>{" "}
          and{" "}
          <Link href="/playlists" className="text-fuchsia-300 underline">
            Playlist Intelligence
          </Link>
          .
        </p>
      </div>

      <Panel
        title="Spark Lists"
        action={
          <PpcLink href={lists.url} label={lists.cta} page="/spark" />
        }
      >
        <p className="mb-4 text-sm text-zinc-400">{lists.blurb} {lists.how}</p>
        <SparkDesk tool={lists} />
      </Panel>

      <Panel
        title="Spark Atlas"
        action={
          <PpcLink href={atlas.url} label={atlas.cta} page="/spark" />
        }
      >
        <p className="mb-4 text-sm text-zinc-400">{atlas.blurb} {atlas.how}</p>
        {artists.length ? (
          <p className="mb-3 flex flex-wrap gap-2 text-sm">
            {artists.map((artist) => (
              <PpcLink key={artist} href={sparkAtlasUrl(artist)} label={artist} page="/spark" />
            ))}
          </p>
        ) : null}
        <SparkDesk tool={atlas} />
      </Panel>

      <Panel title="More Spark tools">
        <div className="grid gap-4 md:grid-cols-3">
          {rest.map((tool) => (
            <article key={tool.id} className="rounded-xl border border-white/10 bg-black/40 p-4">
              <h3 className="font-semibold">{tool.name}</h3>
              <p className="mt-2 text-sm text-zinc-400">{tool.blurb}</p>
              <p className="mt-3">
                {tool.id === "spark-pulse" ? (
                  <Link href="/analyser" className="text-fuchsia-300 underline">
                    Open playlist analyser
                  </Link>
                ) : (
                  <PpcLink href={tool.url} label={tool.cta} page="/spark" />
                )}
              </p>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
