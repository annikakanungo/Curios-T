import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type {
  QuizQuestion,
  MatchingPair,
  Flashcard,
  SpeedItem,
  ScrambleWord,
  SortBucketSet,
  EscapeStage,
} from "@/lib/games";

const panel =
  "rounded-[32px] border border-foreground/5 bg-card p-8 shadow-sm md:p-12";

export function ResultCard({
  title,
  subtitle,
  onReplay,
  replayLabel = "Play Again",
}: {
  title: string;
  subtitle: string;
  onReplay: () => void;
  replayLabel?: string;
}) {
  return (
    <div className={`${panel} animate-fade-in text-center`}>
      <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>
      <Button onClick={onReplay} className="mt-8 rounded-full px-8 py-5 text-base font-bold">
        {replayLabel}
      </Button>
    </div>
  );
}

/* ---------------------------------- Quiz --------------------------------- */

export function QuizGame({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const progress = Math.round(((index + (checked ? 1 : 0)) / questions.length) * 100);

  const reset = () => {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setFinished(false);
  };

  if (!current) return null;

  if (finished) {
    return (
      <ResultCard
        title="Quiz Complete!"
        subtitle={`You scored ${score} / ${questions.length}.`}
        onReplay={reset}
      />
    );
  }

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
    if (index + 1 >= questions.length) setFinished(true);
    else {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  };

  return (
    <div className={panel}>
      <div className="mb-8 flex items-center gap-4">
        <Progress value={progress} className="h-3 flex-1" />
        <span className="font-mono text-xs font-bold uppercase">
          {index + 1}/{questions.length}
        </span>
      </div>

      <h2 className="mb-8 text-center text-2xl font-extrabold leading-tight tracking-tight">
        {current.question}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {current.options.map((option, optIdx) => {
          const isCorrect = optIdx === current.correctIndex;
          const isSelected = selected === optIdx;
          let stateClasses = "border-foreground/5 bg-background/50 hover:border-primary";
          if (checked && isCorrect) stateClasses = "border-primary bg-primary/10 text-primary";
          else if (checked && isSelected) stateClasses = "border-destructive bg-destructive/10 text-destructive";
          else if (isSelected) stateClasses = "border-primary bg-primary/5 text-primary";

          return (
            <button
              key={optIdx}
              disabled={checked}
              onClick={() => setSelected(optIdx)}
              className={`rounded-2xl border-2 p-6 text-left transition-all ${stateClasses}`}
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
          <Button onClick={handleCheck} disabled={selected === null} className="w-full rounded-2xl py-6 text-lg font-extrabold">
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

/* -------------------------------- Matching -------------------------------- */

export function MatchingGame({ pairs }: { pairs: MatchingPair[] }) {
  const [round, setRound] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const shuffledRight = useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5),
    [pairs, round],
  );

  const finished = matched.size === pairs.length && pairs.length > 0;

  if (finished) {
    return (
      <ResultCard
        title="All Matched!"
        subtitle="You cleared the whole board."
        onReplay={() => {
          setMatched(new Set());
          setSelectedLeft(null);
          setRound((r) => r + 1);
        }}
      />
    );
  }

  const attempt = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      setMatched((prev) => new Set(prev).add(leftId));
      toast.success("Match found!");
    } else {
      toast.error("Try again!");
    }
    setSelectedLeft(null);
  };

  return (
    <div className={panel}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {pairs.map((p) => (
            <button
              key={p.id}
              disabled={matched.has(p.id)}
              onClick={() => setSelectedLeft(p.id)}
              className={`w-full rounded-2xl border-2 p-5 text-left font-semibold transition-all ${
                matched.has(p.id)
                  ? "border-primary bg-primary/10 text-primary opacity-60"
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
              disabled={matched.has(p.id) || !selectedLeft}
              onClick={() => selectedLeft && attempt(selectedLeft, p.id)}
              className={`w-full rounded-2xl border-2 p-5 text-left font-semibold transition-all ${
                matched.has(p.id)
                  ? "border-primary bg-primary/10 text-primary opacity-60"
                  : "border-foreground/5 bg-background/50 hover:border-primary"
              }`}
            >
              {p.right}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pick a term on the left, then tap its pair on the right.
      </p>
    </div>
  );
}

/* ------------------------------- Flashcards ------------------------------- */

export function FlashcardGame({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const card = cards[index];

  if (!card) return null;

  if (finished) {
    return (
      <ResultCard
        title="Deck Complete!"
        subtitle={`You reviewed all ${cards.length} cards.`}
        replayLabel="Review Again"
        onReplay={() => {
          setIndex(0);
          setFlipped(false);
          setFinished(false);
        }}
      />
    );
  }

  return (
    <div className={panel}>
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
          Card {index + 1} / {cards.length}
        </span>
        <Progress value={Math.round((index / cards.length) * 100)} className="h-2 w-48" />
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="relative flex min-h-[240px] w-full items-center justify-center rounded-3xl border-2 border-foreground/5 bg-background/50 p-8 text-center transition-all hover:border-primary"
      >
        <span className="text-2xl font-extrabold tracking-tight">
          {flipped ? card.definition : card.term}
        </span>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs uppercase text-muted-foreground">
          {flipped ? "Definition — tap to flip" : "Term — tap to flip"}
        </span>
      </button>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => {
            setFlipped(false);
            if (index + 1 >= cards.length) setFinished(true);
            else setIndex((i) => i + 1);
          }}
          className="rounded-full px-10 py-5 text-base font-bold"
        >
          Next Card
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------- Lightning Round ---------------------------- */

export function SpeedGame({ items }: { items: SpeedItem[] }) {
  const TOTAL = 45;
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [feedback, setFeedback] = useState<"hit" | "miss" | null>(null);
  const [running, setRunning] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [running]);

  const done = !running || index >= items.length;
  const current = items[index];

  if (done) {
    return (
      <ResultCard
        title={timeLeft === 0 ? "Time's Up!" : "Lightning Cleared!"}
        subtitle={`${score} correct · best streak ×${best}`}
        replayLabel="Run It Back"
        onReplay={() => {
          setTimeLeft(TOTAL);
          setIndex(0);
          setScore(0);
          setStreak(0);
          setBest(0);
          setFeedback(null);
          setRunning(true);
        }}
      />
    );
  }

  if (!current) return null;

  const answer = (guess: boolean) => {
    const correct = guess === current.isTrue;
    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBest((b) => Math.max(b, nextStreak));
      setScore((s) => s + 1 + Math.floor(nextStreak / 3));
      setFeedback("hit");
    } else {
      setStreak(0);
      setFeedback("miss");
      toast.error(current.explanation);
    }
    setTimeout(() => {
      setFeedback(null);
      setIndex((i) => i + 1);
    }, 300);
  };

  return (
    <div className={panel}>
      <div className="mb-8 flex items-center justify-between gap-4">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          Streak ×{streak}
        </span>
        <Progress value={(timeLeft / TOTAL) * 100} className="h-3 flex-1" />
        <span className="font-mono text-sm font-extrabold tabular-nums">{timeLeft}s</span>
      </div>

      <div
        className={`flex min-h-[200px] items-center justify-center rounded-3xl border-2 p-8 text-center transition-colors ${
          feedback === "hit"
            ? "border-primary bg-primary/10"
            : feedback === "miss"
              ? "border-destructive bg-destructive/10"
              : "border-foreground/5 bg-background/50"
        }`}
      >
        <p className="text-2xl font-extrabold leading-snug tracking-tight">{current.statement}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Button onClick={() => answer(true)} className="rounded-2xl py-7 text-lg font-extrabold">
          True
        </Button>
        <Button
          onClick={() => answer(false)}
          variant="secondary"
          className="rounded-2xl py-7 text-lg font-extrabold"
        >
          False
        </Button>
      </div>
      <p className="mt-4 text-center font-mono text-xs uppercase text-muted-foreground">
        Score {score} · streaks of 3+ score bonus points
      </p>
    </div>
  );
}

/* ------------------------------ Word Scramble ----------------------------- */

function scramble(word: string) {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  const out = chars.join("");
  return out.toLowerCase() === word.toLowerCase() && word.length > 2 ? scramble(word) : out;
}

export function ScrambleGame({ words }: { words: ScrambleWord[] }) {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [solved, setSolved] = useState(0);
  const [finished, setFinished] = useState(false);
  const current = words[index];
  const puzzle = useMemo(() => (current ? scramble(current.word) : ""), [current]);

  if (!current) return null;

  if (finished) {
    return (
      <ResultCard
        title="Scramble Solved!"
        subtitle={`You unscrambled ${solved} of ${words.length} terms.`}
        onReplay={() => {
          setIndex(0);
          setGuess("");
          setRevealed(false);
          setSolved(0);
          setFinished(false);
        }}
      />
    );
  }

  const next = () => {
    setGuess("");
    setRevealed(false);
    if (index + 1 >= words.length) setFinished(true);
    else setIndex((i) => i + 1);
  };

  const submit = () => {
    if (guess.trim().toLowerCase() === current.word.toLowerCase()) {
      setSolved((s) => s + 1);
      toast.success("Unscrambled!");
      next();
    } else {
      toast.error("Not it yet — check the hint.");
    }
  };

  return (
    <div className={panel}>
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase text-muted-foreground">
          Word {index + 1} / {words.length}
        </span>
        <span className="font-mono text-xs font-bold uppercase text-primary">Solved {solved}</span>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {puzzle.split("").map((ch, i) => (
          <span
            key={i}
            className="flex h-14 w-12 items-center justify-center rounded-xl border-2 border-foreground/5 bg-background/50 font-mono text-2xl font-extrabold uppercase"
          >
            {ch === " " ? "·" : ch}
          </span>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">Hint: {current.hint}</p>

      <input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Type your answer"
        className="mt-6 w-full rounded-2xl border-2 border-foreground/5 bg-background/50 px-5 py-4 text-center text-lg font-bold outline-none focus:border-primary"
      />

      {revealed && (
        <p className="mt-4 text-center text-sm font-semibold text-primary">
          Answer: {current.word}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button onClick={submit} className="rounded-2xl py-6 text-base font-extrabold">
          Submit
        </Button>
        <Button
          variant="secondary"
          onClick={() => (revealed ? next() : setRevealed(true))}
          className="rounded-2xl py-6 text-base font-extrabold"
        >
          {revealed ? "Next Word" : "Reveal"}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------- Sort Frenzy ------------------------------ */

export function SortGame({ set }: { set: SortBucketSet }) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState(0);
  const [round, setRound] = useState(0);
  const queue = useMemo(
    () => [...set.items].sort(() => Math.random() - 0.5),
    [set.items, round],
  );
  const remaining = queue.filter((it) => !placed[it.label]);
  const current = remaining[0];

  if (!current) {
    return (
      <ResultCard
        title="Board Sorted!"
        subtitle={`${set.items.length} items placed with ${wrong} misfires.`}
        replayLabel="Shuffle & Retry"
        onReplay={() => {
          setPlaced({});
          setWrong(0);
          setRound((r) => r + 1);
        }}
      />
    );
  }

  const drop = (category: string) => {
    if (category === current.category) {
      setPlaced((p) => ({ ...p, [current.label]: category }));
      toast.success("Nice sort!");
    } else {
      setWrong((w) => w + 1);
      toast.error(`Not ${category} — think again.`);
    }
  };

  return (
    <div className={panel}>
      <div className="mb-6 flex items-center gap-4">
        <Progress
          value={((set.items.length - remaining.length) / set.items.length) * 100}
          className="h-3 flex-1"
        />
        <span className="font-mono text-xs font-bold uppercase">
          {set.items.length - remaining.length}/{set.items.length}
        </span>
      </div>

      <div className="mx-auto mb-8 flex min-h-[130px] max-w-md items-center justify-center rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 text-center">
        <p className="text-2xl font-extrabold tracking-tight">{current.label}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {set.categories.map((cat) => (
          <button
            key={cat}
            onClick={() => drop(cat)}
            className="rounded-2xl border-2 border-dashed border-foreground/10 bg-background/50 px-5 py-6 text-base font-extrabold transition-all hover:border-primary hover:bg-primary/5"
          >
            {cat}
            <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {Object.values(placed).filter((c) => c === cat).length} placed
            </span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Send each item to the bucket where it belongs.
      </p>
    </div>
  );
}

/* ------------------------------- Escape Room ------------------------------ */

export function EscapeGame({ stages }: { stages: EscapeStage[] }) {
  const [step, setStep] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const stage = stages[step];

  if (!stage) {
    return (
      <ResultCard
        title="You Escaped!"
        subtitle={`All ${stages.length} locks opened in ${stages.length + attempts} tries.`}
        replayLabel="Lock It Again"
        onReplay={() => {
          setStep(0);
          setAttempts(0);
          setHintOpen(false);
        }}
      />
    );
  }

  const tryOption = (idx: number) => {
    if (idx === stage.correctIndex) {
      toast.success("Lock opened!");
      setHintOpen(false);
      setStep((s) => s + 1);
    } else {
      setAttempts((a) => a + 1);
      toast.error("The lock holds firm.");
    }
  };

  return (
    <div className={panel}>
      <div className="mb-6 flex items-center justify-center gap-2">
        {stages.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-10 rounded-full ${i < step ? "bg-primary" : "bg-foreground/10"}`}
          />
        ))}
      </div>

      <span className="block text-center font-mono text-xs font-bold uppercase tracking-widest text-primary">
        Lock {step + 1} of {stages.length}
      </span>
      <h2 className="mx-auto mt-4 max-w-xl text-center text-2xl font-extrabold leading-snug tracking-tight">
        {stage.clue}
      </h2>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {stage.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => tryOption(i)}
            className="rounded-2xl border-2 border-foreground/5 bg-background/50 p-5 text-left font-semibold transition-all hover:border-primary hover:bg-primary/5"
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        {hintOpen ? (
          <p className="text-sm text-muted-foreground">Hint: {stage.hint}</p>
        ) : (
          <Button variant="ghost" onClick={() => setHintOpen(true)} className="text-sm font-bold">
            Need a hint?
          </Button>
        )}
      </div>
    </div>
  );
}
