import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/quests")({
  head: () => ({
    meta: [
      { title: "Quests — Curios T" },
      {
        name: "description",
        content: "Daily quests and learning challenges for Ontario students.",
      },
      { property: "og:title", content: "Quests — Curios T" },
      {
        property: "og:description",
        content: "Daily quests and learning challenges for Ontario students.",
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
    description: "Complete a generated game for any Ontario unit.",
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

function QuestsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter md:text-5xl">Quests</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Complete daily challenges and earn XP, badges, and streak bonuses.
        </p>
      </section>

      <div className="space-y-6">
        {quests.map((quest, idx) => (
          <div
            key={quest.id}
            className="animate-fade-up rounded-3xl border border-foreground/5 bg-white p-6 shadow-sm"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight">{quest.title}</h3>
                <p className="text-sm text-muted-foreground">{quest.description}</p>
              </div>
              <div className="shrink-0 rounded-full bg-accent-peach px-3 py-1 text-xs font-bold text-orange-700">
                {quest.reward}
              </div>
            </div>
            <div className="mt-4">
              <Progress value={quest.progress} className="h-2" />
              <p className="mt-2 text-right text-xs font-mono font-bold text-muted-foreground">
                {quest.progress}%
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button className="rounded-full px-8 py-5 text-base font-bold">Start Daily Quest</Button>
      </div>
    </main>
  );
}
