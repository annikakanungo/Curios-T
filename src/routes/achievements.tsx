import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Lumina" },
      {
        name: "description",
        content: "Track your learning achievements and badges on Lumina.",
      },
      { property: "og:title", content: "Achievements — Lumina" },
      {
        property: "og:description",
        content: "Track your learning achievements and badges on Lumina.",
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
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter md:text-5xl">Achievements</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Collect badges as you master new subjects and skills.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a, idx) => (
          <div
            key={a.id}
            className={`animate-fade-up rounded-3xl border p-6 text-center transition-all ${
              a.unlocked
                ? "border-foreground/5 bg-white shadow-sm"
                : "border-dashed border-foreground/10 bg-background opacity-70"
            }`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div
              className={`mx-auto mb-4 grid size-16 place-items-center rounded-2xl text-2xl ${
                a.unlocked ? "bg-accent-lavender" : "bg-muted"
              }`}
            >
              {a.unlocked ? "🏆" : "🔒"}
            </div>
            <h3 className="text-lg font-extrabold tracking-tight">{a.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
