import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getGameById, getGameContent } from "@/lib/games";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/play/$gameId")({
  head: ({ params }) => ({
    meta: [
      { title: `Play ${params.gameId} — Lumina` },
      {
        name: "description",
        content: "Play an interactive educational game on Lumina.",
      },
      { property: "og:title", content: `Play ${params.gameId} — Lumina` },
      {
        property: "og:description",
        content: "Play an interactive educational game on Lumina.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ params }) => {
    const game = getGameById(params.gameId);
    if (!game) throw notFound();
    return { game, content: getGameContent(params.gameId) };
  },
  component: PlayPage,
});

function PlayPage() {
  const { game, content } = Route.useLoaderData();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            {game.type} Challenge
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">{game.title}</h1>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
          {game.subject}
        </span>
      </div>

      {!content ? (
        <p className="text-center text-muted-foreground">Game content not available.</p>
      ) : game.type === "quiz" ? (
        <QuizGame questions={content.questions} />
      ) : game.type === "matching" ? (
        <MatchingGame pairs={content.pairs} />
      ) : (
        <FlashcardGame cards={content.cards} />
      )}
    </main>
  );
}

function QuizGame({ questions }: { questions: { question: string; options: string[]; correctIndex: number }[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const progress = Math.round(((index + (checked ? 1 : 0)) / questions.length) * 100);

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    if (selected === current.correctIndex) {
      setScore((s) => s + 1);
      toast.success("Correct!");
    } else {
      toast.error("Not quite — review the answer and keep going.");
    }
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  };

  if (finished) {
    return (
      <div className="rounded-[32px] border border-foreground/5 bg-white p-12 text-center shadow-sm">
        <h2 className="text-3xl font-extrabold">Quiz Complete!</h2>
        <p className="mt-4 text-2xl font-bold text-primary">
          {score} / {questions.length}
        </p>
        <p className="mt-2 text-muted-foreground">
          {score === questions.length
            ? "Perfect score — amazing work!"
            : "Great effort. Try again to improve your score."}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-8 rounded-full px-8 py-5 text-base font-bold">
          Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-foreground/5 bg-white p-8 shadow-sm md:p-12">
      <div className="mb-8 flex items-center gap-4">
        <Progress value={progress} className="h-3 flex-1" />
        <span className="font-mono text-xs font-bold uppercase">
          Question {index + 1}/{questions.length}
        </span>
      </div>

      <h2 className="mb-8 text-center text-2xl font-extrabold tracking-tight leading-tight">
        {current.question}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {current.options.map((option, optIdx) => {
          const isCorrect = optIdx === current.correctIndex;
          const isSelected = selected === optIdx;
          let stateClasses =
            "border-2 border-foreground/5 bg-background/50 hover:border-primary";
          if (checked && isCorrect) {
            stateClasses = "border-2 border-green-500 bg-green-50 text-green-900";
          } else if (checked && isSelected && !isCorrect) {
            stateClasses = "border-2 border-red-400 bg-red-50 text-red-900";
          } else if (isSelected) {
            stateClasses = "border-2 border-primary bg-primary/5 text-primary";
          }

          return (
            <button
              key={optIdx}
              disabled={checked}
              onClick={() => setSelected(optIdx)}
              className={`rounded-2xl p-6 text-left transition-all ${stateClasses}`}
            >
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest opacity-70">
                Option {String.fromCharCode(65 + optIdx)}
              </span>
              <span className="font-semibold">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {!checked ? (
          <Button
            onClick={handleCheck}
            disabled={selected === null}
            className="w-full rounded-2xl py-6 text-lg font-extrabold"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full rounded-2xl py-6 text-lg font-extrabold">
            {index + 1 >= questions.length ? "Finish" : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
}

function MatchingGame({ pairs }: { pairs: { id: string; left: string; right: string }[] }) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);

  const shuffledRight = [...pairs].sort(() => Math.random() - 0.5);

  const handleLeft = (id: string) => {
    if (matched.has(id)) return;
    setSelectedLeft(id);
    if (selectedRight) checkMatch(id, selectedRight);
  };

  const handleRight = (id: string) => {
    if (matched.has(id)) return;
    setSelectedRight(id);
    if (selectedLeft) checkMatch(selectedLeft, id);
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      const next = new Set(matched);
      next.add(leftId);
      setMatched(next);
      toast.success("Match found!");
      if (next.size === pairs.length) setFinished(true);
    } else {
      toast.error("Try again!");
    }
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  if (finished) {
    return (
      <div className="rounded-[32px] border border-foreground/5 bg-white p-12 text-center shadow-sm">
        <h2 className="text-3xl font-extrabold">All Matched!</h2>
        <p className="mt-2 text-muted-foreground">You cleared the board.</p>
        <Button onClick={() => window.location.reload()} className="mt-8 rounded-full px-8 py-5 text-base font-bold">
          Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-foreground/5 bg-white p-8 shadow-sm md:p-12">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {pairs.map((p) => (
            <button
              key={p.id}
              disabled={matched.has(p.id)}
              onClick={() => handleLeft(p.id)}
              className={`w-full rounded-2xl border-2 p-5 text-left font-semibold transition-all ${
                matched.has(p.id)
                  ? "border-green-500 bg-green-50 text-green-900 opacity-60"
                  : selectedLeft === p.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-foreground/5 bg-background/50 hover:border-primary"
              }`}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {shuffledRight.map((p) => (
            <button
              key={`r-${p.id}`}
              disabled={matched.has(p.id)}
              onClick={() => handleRight(p.id)}
              className={`w-full rounded-2xl border-2 p-5 text-left font-semibold transition-all ${
                matched.has(p.id)
                  ? "border-green-500 bg-green-50 text-green-900 opacity-60"
                  : selectedRight === p.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-foreground/5 bg-background/50 hover:border-primary"
              }`}
            >
              {p.right}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Select a term on the left, then match it with its pair on the right.
      </p>
    </div>
  );
}

function FlashcardGame({ cards }: { cards: { term: string; definition: string }[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const card = cards[index];

  const handleNext = () => {
    setFlipped(false);
    if (index + 1 >= cards.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (finished) {
    return (
      <div className="rounded-[32px] border border-foreground/5 bg-white p-12 text-center shadow-sm">
        <h2 className="text-3xl font-extrabold">Deck Complete!</h2>
        <p className="mt-2 text-muted-foreground">You reviewed all {cards.length} cards.</p>
        <Button onClick={() => window.location.reload()} className="mt-8 rounded-full px-8 py-5 text-base font-bold">
          Review Again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-foreground/5 bg-white p-8 shadow-sm md:p-12">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
          Card {index + 1} / {cards.length}
        </span>
        <Progress value={Math.round((index / cards.length) * 100)} className="h-2 w-48" />
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="group relative flex min-h-[240px] w-full items-center justify-center rounded-3xl border-2 border-foreground/5 bg-background/50 p-8 text-center transition-all hover:border-primary"
      >
        <span className="text-2xl font-extrabold tracking-tight">
          {flipped ? card.definition : card.term}
        </span>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono uppercase text-muted-foreground">
          {flipped ? "Definition — click to flip" : "Term — click to flip"}
        </span>
      </button>

      <div className="mt-8 flex justify-center">
        <Button onClick={handleNext} className="rounded-full px-10 py-5 text-base font-bold">
          Next Card
        </Button>
      </div>
    </div>
  );
}
