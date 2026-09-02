import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/quests")({
  head: () => ({
    meta: [
      { title: "Quests — Curios T" },
      {
        name: "description",
        content: "Daily quests and learning challenges that bank XP toward certificates.",
      },
      { property: "og:title", content: "Quests — Curios T" },
      {
        property: "og:description",
        content: "Daily quests and learning challenges that bank XP toward certificates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuestsPage,
});

const quests = [
  {
    id: "daily-quiz",
    title: "Daily Quiz Champion",
    description: "Answer 10 quiz questions correctly today.",
    progress: 70,
    reward: "150 XP",
  },
  {
    id: "unit-master",
    title: "Unit Master",
    description: "Complete a generated game for any course unit.",
    progress: 0,
    reward: "300 XP",
  },
  {
    id: "streak-keeper",
    title: "Streak Keeper",
    description: "Play at least one game every day for 7 days.",
    progress: 85,
    reward: "Badge",
  },
];

function PixelBar({ value }: { value: number }) {
  const cells = 20;
  const filled = Math.round((value / 100) * cells);
  return (
    <div className="flex gap-1 border-4 border-foreground bg-background p-1">
      {Array.from({ length: cells }).map((_, i) => (
        <div
          key={i}
          className={`h-3 flex-1 ${i < filled ? "bg-game-green" : "bg-muted"}`}
        />
      ))}
    </div>
  );
}

function QuestsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <section className="hud-panel scanlines mb-8 p-6 md:p-8">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          ▮ DAILY OPS
        </span>
        <h1 className="mt-3 font-display text-xl leading-relaxed md:text-3xl md:leading-relaxed">
          QUESTS
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Clear daily challenges to earn XP, badges and streak bonuses.
        </p>
      </section>

      <div className="space-y-6">
        {quests.map((quest, idx) => (
          <div
            key={quest.id}
            className="hud-panel animate-fade-up p-6"
            style={{ animationDelay: `${idx * 90}ms` }}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">{quest.title}</h2>
                <p className="text-sm text-muted-foreground">{quest.description}</p>
              </div>
              <div className="shrink-0 border-4 border-foreground bg-game-gold px-3 py-1 font-mono text-[10px] font-bold text-game-ink">
                {quest.reward}
              </div>
            </div>
            <div className="mt-4">
              <PixelBar value={quest.progress} />
              <p className="mt-2 text-right font-mono text-[10px] font-bold text-muted-foreground">
                {quest.progress}% COMPLETE
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/generate" className="pixel-btn rounded-none px-8 py-3 font-display text-[10px]">
          START DAILY QUEST
        </Link>
      </div>
    </main>
  );
}
