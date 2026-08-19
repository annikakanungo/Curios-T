import { createFileRoute, Link } from "@tanstack/react-router";
import { games } from "@/lib/games";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Game Library — Lumina" },
      {
        name: "description",
        content: "Browse Ontario curriculum-aligned educational games by subject and grade.",
      },
      { property: "og:title", content: "Game Library — Lumina" },
      {
        property: "og:description",
        content: "Browse Ontario curriculum-aligned educational games by subject and grade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

const accentBg: Record<string, string> = {
  lavender: "bg-accent-lavender",
  mint: "bg-accent-mint",
  peach: "bg-accent-peach",
};

function LibraryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter text-balance md:text-5xl">
          Game Library
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Explore quizzes, matching games, and flashcards built for Ontario courses and units.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game, idx) => (
          <div
            key={game.id}
            className="group animate-fade-up rounded-3xl border border-foreground/5 bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div
              className={`grid aspect-[4/3] w-full place-items-center rounded-2xl ${accentBg[game.accent]} mb-4 overflow-hidden`}
            >
              <img
                src={game.image}
                alt={game.title}
                width={800}
                height={600}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="px-4 pb-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-xl font-extrabold tracking-tight">{game.title}</h3>
                <span className="rounded bg-foreground/5 px-2 py-0.5 font-mono text-[10px]">
                  LVL {game.level}
                </span>
              </div>
              <p className="text-sm text-muted-foreground text-pretty">{game.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                  {game.subject}
                </span>
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/play/$gameId" params={{ gameId: game.id }}>
                    Play
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-16 rounded-[32px] border border-foreground/5 bg-white p-8 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Want a game for your exact unit?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Pick your Ontario course and unit, and Lumina will generate a custom study game for that material.
        </p>
        <Button asChild className="mt-6 rounded-full px-8 py-5 text-base font-bold">
          <Link to="/generate">Generate a Game</Link>
        </Button>
      </section>
    </main>
  );
}
