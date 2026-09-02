import { createFileRoute, Link } from "@tanstack/react-router";
import { games } from "@/lib/games";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Curios T — Mission Command for Study Games" },
      {
        name: "description",
        content:
          "A retro mission-command dashboard for Ontario, IB and AP study games. Generate quizzes, matching, flashcards, escape rooms and more from your course unit.",
      },
      { property: "og:title", content: "Curios T — Mission Command for Study Games" },
      {
        property: "og:description",
        content:
          "Retro arcade dashboard for curriculum-aligned study games across Ontario, IB and AP courses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const accentBg: Record<string, string> = {
  lavender: "bg-game-blue/20",
  mint: "bg-game-green/20",
  peach: "bg-game-gold/25",
};

const stats = [
  { label: "XP", value: "2,450", color: "text-game-gold" },
  { label: "Streak", value: "07", color: "text-game-red" },
  { label: "Modes", value: "09", color: "text-game-green" },
  { label: "Systems", value: "03", color: "text-game-blue" },
];

const missions = [
  { code: "M-01", name: "Pick your course", detail: "Ontario · IB · AP", status: "READY" },
  { code: "M-02", name: "Generate a unit game", detail: "9 arcade modes", status: "READY" },
  { code: "M-03", name: "Bank XP", detail: "Every correct answer", status: "LIVE" },
  { code: "M-04", name: "Redeem a certificate", detail: "Printable proof", status: "LOCKED" },
];

function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      {/* HUD hero */}
      <section className="scanlines hud-panel animate-fade-up overflow-hidden">
        <div className="flex items-center justify-between border-b-4 border-foreground bg-foreground px-4 py-2">
          <span className="font-display text-[10px] text-background">MISSION COMMAND</span>
          <span className="font-mono text-[10px] font-bold text-background">SYS · ONLINE</span>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <h1 className="font-display text-2xl leading-relaxed text-foreground md:text-4xl md:leading-relaxed">
              PLAY YOUR WAY
              <br />
              TO <span className="text-primary text-shadow-pixel">MASTERY</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground">
              Choose your course unit. Curios T builds the game — quizzes, matching, escape rooms,
              word forges and battleship grids straight from your curriculum.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/generate" className="pixel-btn rounded-none px-6 py-3 font-display text-[10px]">
                START MISSION
              </Link>
              <Link
                to="/library"
                className="pixel-btn-outline rounded-none px-6 py-3 font-display text-[10px]"
              >
                LIBRARY
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-start">
            {stats.map((s) => (
              <div key={s.label} className="border-4 border-foreground bg-background p-4 text-center">
                <p className={`font-display text-lg ${s.color}`}>{s.value}</p>
                <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission board */}
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <div className="hud-panel animate-fade-up p-6" style={{ animationDelay: "80ms" }}>
          <h2 className="font-display text-xs text-foreground">MISSION BOARD</h2>
          <ul className="mt-5 space-y-3">
            {missions.map((m) => (
              <li
                key={m.code}
                className="flex items-center justify-between border-4 border-foreground bg-background px-3 py-3"
              >
                <div>
                  <p className="font-mono text-[10px] font-bold text-muted-foreground">{m.code}</p>
                  <p className="text-sm font-bold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.detail}</p>
                </div>
                <span
                  className={`border-2 border-foreground px-2 py-1 font-mono text-[9px] font-bold ${
                    m.status === "LOCKED"
                      ? "bg-muted text-muted-foreground"
                      : m.status === "LIVE"
                        ? "bg-game-green text-background"
                        : "bg-game-gold text-game-ink"
                  }`}
                >
                  {m.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-xs">LEVEL SELECT</h2>
            <Link to="/library" className="font-mono text-xs font-bold text-primary hover:underline">
              VIEW ALL →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {games.slice(0, 4).map((game, idx) => (
              <div
                key={game.id}
                className="hud-panel animate-fade-up flex flex-col p-3"
                style={{ animationDelay: `${200 + idx * 80}ms` }}
              >
                <div
                  className={`mb-3 grid aspect-[4/3] w-full place-items-center overflow-hidden border-4 border-foreground ${accentBg[game.accent]}`}
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
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-extrabold tracking-tight">{game.title}</h3>
                  <span className="shrink-0 border-2 border-foreground bg-secondary px-2 py-0.5 font-mono text-[9px] font-bold">
                    LVL {game.level}
                  </span>
                </div>
                <p className="mt-1 flex-1 text-xs text-muted-foreground">{game.description}</p>
                <Link
                  to="/play/$gameId"
                  params={{ gameId: game.id }}
                  className="pixel-btn mt-4 rounded-none px-4 py-2 font-display text-[9px]"
                >
                  PLAY
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status bar */}
      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border-4 border-foreground bg-foreground px-5 py-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-background">
          ▮ PILOT STATUS · ACTIVE
        </span>
        <div className="flex flex-wrap gap-5">
          <Link to="/progress" className="font-mono text-[10px] font-bold uppercase text-game-gold hover:underline">
            PROGRESS
          </Link>
          <Link to="/prizes" className="font-mono text-[10px] font-bold uppercase text-game-gold hover:underline">
            PRIZES
          </Link>
          <Link to="/quests" className="font-mono text-[10px] font-bold uppercase text-game-gold hover:underline">
            QUESTS
          </Link>
        </div>
      </section>
    </main>
  );
}
