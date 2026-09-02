import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Curios T" },
      {
        name: "description",
        content: "Track your learning achievements and unlock retro badges on Curios T.",
      },
      { property: "og:title", content: "Achievements — Curios T" },
      {
        property: "og:description",
        content: "Track your learning achievements and unlock retro badges on Curios T.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AchievementsPage,
});

const achievements = [
  { id: "first-game", title: "First Steps", description: "Play your first game.", unlocked: true },
  { id: "quiz-whiz", title: "Quiz Whiz", description: "Get 5 quiz answers correct in a row.", unlocked: true },
  { id: "match-maker", title: "Match Maker", description: "Complete a matching game without mistakes.", unlocked: false },
  { id: "streak-7", title: "Week Warrior", description: "Maintain a 7-day streak.", unlocked: true },
  { id: "unit-explorer", title: "Unit Explorer", description: "Generate a game for 3 different units.", unlocked: false },
  { id: "history-buff", title: "History Buff", description: "Complete all history games.", unlocked: false },
];

function AchievementsPage() {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <section className="hud-panel scanlines mb-8 flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-8">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            ▮ TROPHY ROOM
          </span>
          <h1 className="mt-3 font-display text-xl leading-relaxed md:text-3xl md:leading-relaxed">
            ACHIEVEMENTS
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Collect badges as you master new subjects and skills.
          </p>
        </div>
        <div className="border-4 border-foreground bg-background px-5 py-3 text-center">
          <p className="font-display text-base text-game-gold">
            {unlocked}/{achievements.length}
          </p>
          <p className="mt-2 font-mono text-[10px] font-bold uppercase text-muted-foreground">
            Unlocked
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a, idx) => (
          <div
            key={a.id}
            className={`animate-fade-up border-4 p-6 text-center ${
              a.unlocked
                ? "hud-panel border-foreground"
                : "border-dashed border-foreground/40 bg-background opacity-70"
            }`}
            style={{ animationDelay: `${idx * 70}ms` }}
          >
            <div
              className={`mx-auto mb-4 grid size-16 place-items-center border-4 border-foreground text-2xl ${
                a.unlocked ? "bg-game-gold" : "bg-muted"
              }`}
            >
              {a.unlocked ? "🏆" : "🔒"}
            </div>
            <h2 className="text-base font-extrabold tracking-tight">{a.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
            <p
              className={`mt-4 font-mono text-[9px] font-bold uppercase tracking-widest ${
                a.unlocked ? "text-game-green" : "text-muted-foreground"
              }`}
            >
              {a.unlocked ? "Unlocked" : "Locked"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
