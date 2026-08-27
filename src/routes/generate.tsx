import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { decodeGenerationError, type GenerationErrorCode } from "@/lib/game-generation";
import { OBJECTIVE_TEMPLATES } from "@/lib/objective-templates";
import {
  getCoursesBySystem,
  getCourseById,
  curriculumSystems,
  type CurriculumSystem,
} from "@/lib/curriculum";
import { generateGame, type GeneratedGame } from "@/lib/games.functions";
import {
  QuizGame,
  MatchingGame,
  FlashcardGame,
  SpeedGame,
  ScrambleGame,
  SortGame,
  EscapeGame,
  WordBuildGame,
  BattleshipGame,
} from "@/components/games/GameShells";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      { title: "Generate a Game — Curios T" },
      {
        name: "description",
        content: "Generate Ontario, IB, or AP curriculum study games tuned to difficulty and learning objectives.",
      },
      { property: "og:title", content: "Generate a Game — Curios T" },
      {
        property: "og:description",
        content: "Generate Ontario, IB, or AP curriculum study games tuned to difficulty and learning objectives.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeneratePage,
});

type GeneratedGameType = NonNullable<GeneratedGame>["type"];

const gameTypeLabels: Record<GeneratedGameType, string> = {
  quiz: "Multiple-Choice Quiz",
  matching: "Matching Pairs",
  flashcards: "Flashcards",
  speed: "Lightning Round",
  scramble: "Word Scramble",
  sort: "Sort Frenzy",
  escape: "Escape Room",
  wordbuild: "Word Forge",
  battleship: "Concept Fleet",
};

const GAME_TYPE_OPTIONS: { value: GeneratedGameType; emoji: string; hint: string }[] = [
  { value: "quiz", emoji: "❓", hint: "4-option questions" },
  { value: "matching", emoji: "🔗", hint: "Pair terms & defs" },
  { value: "flashcards", emoji: "🃏", hint: "Flip & review" },
  { value: "speed", emoji: "⚡", hint: "45s true/false" },
  { value: "scramble", emoji: "🔀", hint: "Unscramble terms" },
  { value: "sort", emoji: "🗂️", hint: "Sort into buckets" },
  { value: "escape", emoji: "🚪", hint: "Crack clue locks" },
  { value: "wordbuild", emoji: "🔤", hint: "Scrabble tiles" },
  { value: "battleship", emoji: "🚢", hint: "Quiz + grid battle" },
];

const GRADES = ["1","2","3","4","5","6","7","8","9","10","11","12"];

const DIFFICULTIES = [
  { value: "intro", label: "Intro", hint: "Recall & basics" },
  { value: "standard", label: "Standard", hint: "Course level" },
  { value: "challenge", label: "Challenge", hint: "Multi-step" },
  { value: "exam", label: "Exam", hint: "Exam rigour" },
] as const;

type Difficulty = (typeof DIFFICULTIES)[number]["value"];

const generatedShips = [
  { name: "Scout", cells: [2, 3] },
  { name: "Cruiser", cells: [11, 16, 21] },
  { name: "Flagship", cells: [7, 8, 9] },
];

const CREDIT_KEY = "curiost.creditState";

type CreditState = "ok" | "low" | "exhausted";

function readCreditState(): CreditState {
  if (typeof window === "undefined") return "ok";
  const raw = window.localStorage.getItem(CREDIT_KEY);
  return raw === "low" || raw === "exhausted" ? raw : "ok";
}

function writeCreditState(state: CreditState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CREDIT_KEY, state);
}

function CreditNotice({
  state,
  onRecheck,
}: {
  state: Exclude<CreditState, "ok">;
  onRecheck: () => void;
}) {
  const exhausted = state === "exhausted";
  return (
    <div
      role="alert"
      className={`mb-6 rounded-2xl border-2 p-5 ${
        exhausted ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <p className="text-sm font-extrabold tracking-tight">
        {exhausted ? "AI credits used up" : "AI credits are running low"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {exhausted
          ? "Generation is paused until more credits are added to this workspace. Add credits or upgrade your plan to keep building games."
          : "The generator hit its usage limit for now. You can wait a moment and retry, or top up credits to keep generating without pauses."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild className="rounded-full px-5 text-sm font-bold">
          <a
            href="https://lovable.dev/settings/workspace"
            target="_blank"
            rel="noreferrer noopener"
          >
            Add credits / upgrade
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={onRecheck}
          className="rounded-full px-5 text-sm font-bold"
        >
          I&apos;ve topped up — try again
        </Button>
      </div>
    </div>
  );
}

function GeneratePage() {
  const [mode, setMode] = useState<"course" | "topic">("course");
  const [system, setSystem] = useState<CurriculumSystem>("Ontario");
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [objectives, setObjectives] = useState("");
  const [courseId, setCourseId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [gameType, setGameType] = useState<GeneratedGameType>("quiz");
  const [generated, setGenerated] = useState<GeneratedGame | null>(null);
  const [sourceLabel, setSourceLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [creditState, setCreditState] = useState<CreditState>("ok");

  useEffect(() => {
    setCreditState(readCreditState());
  }, []);

  const courses = getCoursesBySystem(system);
  const course = getCourseById(courseId);
  const unit = course?.units.find((u) => u.id === unitId);

  const topicReady = grade !== "" && subject.trim() !== "" && section.trim() !== "";
  const creditsBlocked = creditState !== "ok";
  const inputsReady = mode === "course" ? Boolean(unit) : topicReady;
  const canGenerate = inputsReady && !creditsBlocked;

  const applyTemplate = (text: string) => {
    setObjectives((prev) => {
      if (!prev.trim()) return text.slice(0, 500);
      if (prev.includes(text)) return prev;
      return `${prev.trim()} ${text}`.slice(0, 500);
    });
  };

  const clearCreditBlock = () => {
    writeCreditState("ok");
    setCreditState("ok");
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    try {
      const payload =
        mode === "course" && course && unit
          ? {
              courseCode: course.code,
              courseName: `${system} — ${course.name}`,
              unitTitle: unit.title,
              topics: unit.topics,
              gameType,
              difficulty,
              objectives,
            }
          : {
              courseCode: `Grade ${grade}`,
              courseName: `${subject.trim()} (Grade ${grade})`,
              unitTitle: section.trim(),
              topics: [section.trim(), subject.trim()],
              gameType,
              difficulty,
              objectives,
            };

      const result = await generateGame({ data: payload });
      setGenerated(result);
      setSourceLabel(
        mode === "course"
          ? `${system} · ${course?.code} — ${unit?.title}`
          : `Grade ${grade} ${subject.trim()} — ${section.trim()}`,
      );
      toast.success("Game generated!");
      if (creditState !== "ok") clearCreditBlock();
    } catch (err) {
      console.error(err);
      const { code, message } = decodeGenerationError(
        err instanceof Error ? err.message : String(err),
      );
      const nextState: Record<GenerationErrorCode, CreditState> = {
        CREDITS_EXHAUSTED: "exhausted",
        RATE_LIMITED: "low",
        UNAVAILABLE: "ok",
        BAD_RESPONSE: "ok",
      };
      const state = nextState[code];
      if (state !== "ok") {
        writeCreditState(state);
        setCreditState(state);
        toast.error(
          state === "exhausted" ? "AI credits are used up." : "Credit limit reached — try again shortly.",
        );
      } else {
        toast.error(message || "Could not generate the game. Please try again.");
      }
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
          Pick an Ontario, IB, or AP course and unit — or just type your grade, subject, and topic.
          Tune the difficulty and learning objectives, and Curios T builds a custom quiz, matching
          game, or flashcard deck from it.
        </p>
      </section>

      <div className="rounded-[32px] border border-foreground/5 bg-white p-8 shadow-sm">
        {creditState !== "ok" && (
          <CreditNotice state={creditState} onRecheck={clearCreditBlock} />
        )}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-background/60 p-1">
          {([
            ["course", "Course catalogue"],
            ["topic", "Grade + topic"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                mode === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {mode === "course" ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold">Curriculum system</label>
                <div className="grid grid-cols-3 gap-2">
                  {curriculumSystems.map((sys) => (
                    <button
                      key={sys}
                      onClick={() => {
                        setSystem(sys);
                        setCourseId("");
                        setUnitId("");
                      }}
                      className={`rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all ${
                        system === sys
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-foreground/5 bg-background/50 hover:border-primary"
                      }`}
                    >
                      {sys}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Course</label>
                <Select value={courseId} onValueChange={(v) => { setCourseId(v); setUnitId(""); }}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.code} — {c.name}
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
            </>
          ) : (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold">Grade</label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        Grade {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-semibold">
                  Subject
                </label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Math"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label htmlFor="section" className="mb-2 block text-sm font-semibold">
                  Section / topic
                </label>
                <Input
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g. Addition"
                  className="rounded-xl"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold">Difficulty</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                    difficulty === d.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-foreground/5 bg-background/50 hover:border-primary"
                  }`}
                >
                  <span className="block">{d.label}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    {d.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="objectives" className="mb-2 block text-sm font-semibold">
              Learning objectives <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              id="objectives"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="e.g. Solve quadratics by factoring and identify the vertex from factored form"
              className="rounded-xl"
            />
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              {objectives.length}/500 — every question will target these outcomes.
            </p>

            <div className="mt-3">
              <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Quick templates
              </p>
              <div className="flex flex-wrap gap-2">
                {OBJECTIVE_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => applyTemplate(t.text)}
                    title={t.text}
                    className="rounded-full border border-foreground/10 bg-background/60 px-3 py-1.5 text-xs font-bold transition-colors hover:border-primary hover:text-primary"
                  >
                    {t.label}
                    <span className="ml-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      {t.subject}
                    </span>
                  </button>
                ))}
                {objectives && (
                  <button
                    type="button"
                    onClick={() => setObjectives("")}
                    className="rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Game Type</label>
            <div className="grid grid-cols-3 gap-2">
              {GAME_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGameType(opt.value)}
                  className={`rounded-xl border-2 px-3 py-3 text-left transition-all ${
                    gameType === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-foreground/5 bg-background/50 hover:border-primary"
                  }`}
                >
                  <span className="block text-lg">{opt.emoji}</span>
                  <span className="mt-1 block text-xs font-bold">
                    {gameTypeLabels[opt.value]}
                  </span>
                  <span className="block font-mono text-[10px] text-muted-foreground">
                    {opt.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="w-full rounded-2xl py-6 text-lg font-extrabold"
          >
            {loading
              ? "Generating..."
              : creditsBlocked
                ? "Generation paused — add credits"
                : "Generate Game"}
          </Button>
        </div>
      </div>


      {generated && (
        <div className="mt-10 rounded-[32px] border border-foreground/5 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Your {gameTypeLabels[generated.type]}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {sourceLabel}
          </p>

          <div className="mt-6">
            {generated.type === "quiz" && <QuizGame questions={generated.questions} />}
            {generated.type === "matching" && <MatchingGame pairs={generated.pairs} />}
            {generated.type === "flashcards" && <FlashcardGame cards={generated.cards} />}
            {generated.type === "speed" && <SpeedGame items={generated.items} />}
            {generated.type === "scramble" && <ScrambleGame words={generated.words} />}
            {generated.type === "sort" && <SortGame set={generated.set} />}
            {generated.type === "escape" && <EscapeGame stages={generated.stages} />}
            {generated.type === "wordbuild" && <WordBuildGame puzzles={generated.puzzles} />}
            {generated.type === "battleship" && (
              <BattleshipGame
                set={{ size: 5, ships: generatedShips, questions: generated.questions }}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}

