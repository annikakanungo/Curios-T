import { createFileRoute, Link } from "@tanstack/react-router";
import { games } from "@/lib/games";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Game Library — Curios T" },
      {
        name: "description",
        content: "Browse curriculum-aligned educational games by subject, mode and level.",
      },
      { property: "og:title", content: "Game Library — Curios T" },
      {
        property: "og:description",
        content: "Browse curriculum-aligned educational games by subject, mode and level.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

const accentBg: Record<string, string> = {
  lavender: "bg-game-blue/20",
  mint: "bg-game-green/20",
  peach: "bg-game-gold/25",
};

function LibraryPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <section className="hud-panel scanlines mb-8 p-6 md:p-8">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          ▮ ARCHIVE
        </span>
        <h1 className="mt-3 font-display text-xl leading-relaxed md:text-3xl md:leading-relaxed">
          GAME LIBRARY
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Quizzes, matching, flashcards, word forges, battleship grids, lightning rounds and escape
          rooms — all built for real course units.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game, idx) => (
          <div
            key={game.id}
            className="hud-panel animate-fade-up flex flex-col p-3"
            style={{ animationDelay: `${idx * 70}ms` }}
          >
            <div
              className={`mb-4 grid aspect-[4/3] w-full place-items-center overflow-hidden border-4 border-foreground ${accentBg[game.accent]}`}
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
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-extrabold tracking-tight">{game.title}</h2>
              <span className="shrink-0 border-2 border-foreground bg-secondary px-2 py-0.5 font-mono text-[9px] font-bold">
                LVL {game.level}
              </span>
            </div>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{game.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="border-2 border-foreground bg-background px-2 py-1 font-mono text-[9px] font-bold uppercase">
                {game.subject}
              </span>
              <Link
                to="/play/$gameId"
                params={{ gameId: game.id }}
                className="pixel-btn rounded-none px-4 py-2 font-display text-[9px]"
              >
                PLAY
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="hud-panel mt-12 p-8 text-center">
        <h2 className="font-display text-sm leading-relaxed md:text-base md:leading-relaxed">
          NEED A GAME FOR YOUR UNIT?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Pick your Ontario, IB or AP course and unit, and Curios T generates a custom study game.
        </p>
        <Link to="/generate" className="pixel-btn mt-6 rounded-none px-6 py-3 font-display text-[10px]">
          GENERATE A GAME
        </Link>
      </section>
    </main>
  );
}
