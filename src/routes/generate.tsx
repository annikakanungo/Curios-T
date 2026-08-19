import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ontarioCourses, getUnitById } from "@/lib/curriculum";
import { generateGame, type GeneratedGame } from "@/lib/games.functions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate a Game — Lumina" },
      {
        name: "description",
        content: "Pick an Ontario course and unit to generate a custom study game.",
      },
      { property: "og:title", content: "Generate a Game — Lumina" },
      {
        property: "og:description",
        content: "Pick an Ontario course and unit to generate a custom study game.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeneratePage,
});

const gameTypeLabels: Record<string, string> = {
  quiz: "Multiple-Choice Quiz",
  matching: "Matching Pairs",
  flashcards: "Flashcards",
};

function GeneratePage() {
  const [courseId, setCourseId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [gameType, setGameType] = useState<"quiz" | "matching" | "flashcards">("quiz");
  const [generated, setGenerated] = useState<GeneratedGame | null>(null);
  const [loading, setLoading] = useState(false);

  const course = ontarioCourses.find((c) => c.id === courseId);
  const unit = course && getUnitById(course.id, unitId);

  const handleGenerate = async () => {
    if (!course || !unit) return;
    setLoading(true);
    try {
      const result = await generateGame({
        data: {
          courseCode: course.code,
          courseName: course.name,
          unitTitle: unit.title,
          topics: unit.topics,
          gameType,
        },
      });
      setGenerated(result);
      toast.success("Game generated!");
    } catch (err) {
      console.error(err);
      toast.error("Could not generate the game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter md:text-5xl">
          Generate a Study Game
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Choose your Ontario course and unit. Lumina will build a custom quiz, matching game, or flashcard deck from that material.
        </p>
      </section>

      <div className="rounded-[32px] border border-foreground/5 bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold">Course</label>
            <Select value={courseId} onValueChange={(v) => { setCourseId(v); setUnitId(""); }}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {ontarioCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.code} — {c.name} (Grade {c.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Unit</label>
            <Select value={unitId} onValueChange={setUnitId} disabled={!course}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={course ? "Select a unit" : "Choose a course first"} />
              </SelectTrigger>
              <SelectContent>
                {course?.units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Game Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(["quiz", "matching", "flashcards"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setGameType(type)}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                    gameType === type
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-foreground/5 bg-background/50 hover:border-primary"
                  }`}
                >
                  {gameTypeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!unit || loading}
            className="w-full rounded-2xl py-6 text-lg font-extrabold"
          >
            {loading ? "Generating..." : "Generate Game"}
          </Button>
        </div>
      </div>

      {generated && (
        <div className="mt-10 rounded-[32px] border border-foreground/5 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Your {gameTypeLabels[generated.type]}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {course?.code} — {unit?.title}
          </p>

          {generated.type === "quiz" && (
            <GeneratedQuizPreview questions={generated.questions} />
          )}
          {generated.type === "matching" && (
            <GeneratedMatchingPreview pairs={generated.pairs} />
          )}
          {generated.type === "flashcards" && (
            <GeneratedFlashcardsPreview cards={generated.cards} />
          )}
        </div>
      )}
    </main>
  );
}

function GeneratedQuizPreview({ questions }: { questions: { question: string; options: string[]; correctIndex: number }[] }) {
  return (
    <div className="mt-6 space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="rounded-2xl border border-foreground/5 bg-background/50 p-5">
          <p className="font-semibold">
            {i + 1}. {q.question}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            {q.options.map((opt, j) => (
              <li
                key={j}
                className={`rounded-lg px-3 py-2 text-sm ${
                  j === q.correctIndex ? "bg-green-50 font-semibold text-green-900" : "bg-white"
                }`}
              >
                {String.fromCharCode(65 + j)}. {opt}
                {j === q.correctIndex && <span className="ml-2">✓</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function GeneratedMatchingPreview({ pairs }: { pairs: { id: string; left: string; right: string }[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      {pairs.map((p) => (
        <div key={p.id} className="col-span-2 rounded-2xl border border-foreground/5 bg-background/50 p-4 md:col-span-1">
          <p className="font-semibold">{p.left}</p>
          <p className="mt-1 text-sm text-muted-foreground">{p.right}</p>
        </div>
      ))}
    </div>
  );
}

function GeneratedFlashcardsPreview({ cards }: { cards: { term: string; definition: string }[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((c, i) => (
        <div key={i} className="rounded-2xl border border-foreground/5 bg-background/50 p-5">
          <p className="font-semibold">{c.term}</p>
          <p className="mt-1 text-sm text-muted-foreground">{c.definition}</p>
        </div>
      ))}
    </div>
  );
}
