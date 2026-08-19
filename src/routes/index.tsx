import { createFileRoute, Link } from "@tanstack/react-router";
import { games } from "@/lib/games";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "learn.fun — Play your way to mastery" },
      {
        name: "description",
        content:
          "Ontario curriculum-aligned educational games for K-12 students. Quizzes, matching, and flashcards built for the course unit you're studying.",
      },
      { property: "og:title", content: "learn.fun — Play your way to mastery" },
      {
        property: "og:description",
        content:
          "Ontario curriculum-aligned educational games for K-12 students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const accentHover: Record<string, string> = {
  lavender: "hover:bg-accent-lavender",
  mint: "hover:bg-accent-mint",
  peach: "hover:bg-accent-peach",
};

function HomePage() {
  return (
    <div className="pb-28">
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <section className="animate-fade-up text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tighter text-balance md:text-7xl">
            Play your way to <span className="text-primary">mastery.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Ontario curriculum-aligned games that turn any course unit into a quiz, matching challenge, or flashcard deck.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full px-6 py-5 text-base font-bold shadow-lg shadow-primary/20 ring-2 ring-primary/10">
              <Link to="/generate">Generate for My Unit</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6 py-5 text-base font-semibold">
              <Link to="/library">Browse Library</Link>
            </Button>
          </div>
        </section>

        {/* Featured games */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Featured Games</h2>
              <p className="text-sm text-muted-foreground">Ready-to-play challenges across subjects.</p>
            </div>
            <Link to="/library" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game, idx) => (
              <div
                key={game.id}
                className="group animate-fade-up rounded-3xl border border-foreground/5 bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-2xl ${
                    game.accent === "lavender"
                      ? "bg-accent-lavender"
                      : game.accent === "mint"
                        ? "bg-accent-mint"
                        : "bg-accent-peach"
                  } mb-4`}
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    width={800}
                    height={600}
                    loading={idx === 0 ? "eager" : "lazy"}
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
        </section>

        {/* Quiz preview */}
        <section className="mt-20 animate-fade-up rounded-[32px] border border-foreground/5 bg-white shadow-2xl" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between bg-foreground/5 px-8 py-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="h-3 w-full max-w-md overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full w-2/3 bg-primary transition-all duration-1000" />
              </div>
              <span className="font-mono text-xs font-bold">QUEST 08/12</span>
            </div>
            <button className="grid size-8 place-items-center rounded-full border border-foreground/10 bg-white text-xs">
              ✕
            </button>
          </div>

          <div className="mx-auto max-w-2xl space-y-8 p-12 text-center">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Quiz Challenge
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-balance leading-tight">
              Which layer of the Earth is composed primarily of liquid iron and nickel?
            </h2>

            <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-2">
              {[
                { label: "OPTION A", text: "The Lithosphere" },
                { label: "OPTION B", text: "The Outer Core", selected: true },
                { label: "OPTION C", text: "The Asthenosphere" },
                { label: "OPTION D", text: "The Inner Crust" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  className={`rounded-2xl border-2 p-6 text-left transition-all ${
                    opt.selected
                      ? "border-primary bg-primary/5"
                      : "border-foreground/5 bg-background/50 hover:border-primary"
                  }`}
                >
                  <span
                    className={`mb-1 block font-mono text-[10px] uppercase tracking-widest ${
                      opt.selected ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="font-semibold">{opt.text}</span>
                </button>
              ))}
            </div>

            <Button className="w-full rounded-2xl py-6 text-lg font-extrabold shadow-xl shadow-primary/20">
              Check Answer
            </Button>
          </div>
        </section>
      </main>

      {/* Sticky progress footer */}
      <footer className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-full bg-foreground px-6 py-3 text-background shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-accent-mint" />
          <span className="font-mono text-xs font-bold uppercase tracking-tight">Points: 2,450</span>
        </div>
        <div className="h-4 w-px bg-background/20" />
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-accent-peach" />
          <span className="font-mono text-xs font-bold uppercase tracking-tight">Next Goal: Physics Champ</span>
        </div>
      </footer>
    </div>
  );
}
