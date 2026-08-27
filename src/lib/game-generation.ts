import { z } from "zod";
import type {
  QuizQuestion,
  MatchingPair,
  Flashcard,
  SpeedItem,
  ScrambleWord,
  SortBucketSet,
  EscapeStage,
  WordBuildPuzzle,
} from "./games";

export const GenerateGameInput = z.object({
  courseCode: z.string(),
  courseName: z.string(),
  unitTitle: z.string(),
  topics: z.array(z.string()),
  gameType: z.enum([
    "quiz",
    "matching",
    "flashcards",
    "speed",
    "scramble",
    "sort",
    "escape",
    "wordbuild",
    "battleship",
  ]),
  difficulty: z.enum(["intro", "standard", "challenge", "exam"]).default("standard"),
  objectives: z.string().max(500).default(""),
});

export type GenerateGameInputType = z.infer<typeof GenerateGameInput>;

export const DIFFICULTY_GUIDE: Record<string, string> = {
  intro: "Introductory level: recall and basic understanding, simple wording, one-step reasoning.",
  standard: "Standard course level: solid understanding and application, typical classwork difficulty.",
  challenge: "Challenge level: multi-step reasoning, analysis, and less obvious distractors.",
  exam: "Exam level: rigorous, exam-style items testing synthesis, evaluation, and precise terminology.",
};

export const QuizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number(),
    }),
  ),
});

export const MatchingSchema = z.object({
  pairs: z.array(
    z.object({
      id: z.string(),
      left: z.string(),
      right: z.string(),
    }),
  ),
});

export const FlashcardsSchema = z.object({
  cards: z.array(
    z.object({
      term: z.string(),
      definition: z.string(),
    }),
  ),
});

export const SpeedSchema = z.object({
  items: z.array(
    z.object({
      statement: z.string(),
      isTrue: z.boolean(),
      explanation: z.string(),
    }),
  ),
});

export const ScrambleSchema = z.object({
  words: z.array(
    z.object({
      word: z.string(),
      hint: z.string(),
    }),
  ),
});

export const SortSchema = z.object({
  categories: z.array(z.string()),
  items: z.array(
    z.object({
      label: z.string(),
      category: z.string(),
    }),
  ),
});

export const EscapeSchema = z.object({
  stages: z.array(
    z.object({
      clue: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number(),
      hint: z.string(),
    }),
  ),
});

export const WordBuildSchema = z.object({
  puzzles: z.array(
    z.object({
      answer: z.string(),
      clue: z.string(),
    }),
  ),
});

export const BattleshipSchema = z.object({
  questions: QuizSchema.shape.questions,
});

export type GeneratedGame =
  | { type: "quiz"; questions: QuizQuestion[] }
  | { type: "matching"; pairs: MatchingPair[] }
  | { type: "flashcards"; cards: Flashcard[] }
  | { type: "speed"; items: SpeedItem[] }
  | { type: "scramble"; words: ScrambleWord[] }
  | { type: "sort"; set: SortBucketSet }
  | { type: "escape"; stages: EscapeStage[] }
  | { type: "wordbuild"; puzzles: WordBuildPuzzle[] }
  | { type: "battleship"; questions: QuizQuestion[] };

export const JSON_SCHEMAS = {
  quiz: {
    type: "object",
    additionalProperties: false,
    required: ["questions"],
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["question", "options", "correctIndex"],
          properties: {
            question: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correctIndex: { type: "integer" },
          },
        },
      },
    },
  },
  matching: {
    type: "object",
    additionalProperties: false,
    required: ["pairs"],
    properties: {
      pairs: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "left", "right"],
          properties: {
            id: { type: "string" },
            left: { type: "string" },
            right: { type: "string" },
          },
        },
      },
    },
  },
  flashcards: {
    type: "object",
    additionalProperties: false,
    required: ["cards"],
    properties: {
      cards: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["term", "definition"],
          properties: {
            term: { type: "string" },
            definition: { type: "string" },
          },
        },
      },
    },
  },
  speed: {
    type: "object",
    additionalProperties: false,
    required: ["items"],
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["statement", "isTrue", "explanation"],
          properties: {
            statement: { type: "string" },
            isTrue: { type: "boolean" },
            explanation: { type: "string" },
          },
        },
      },
    },
  },
  scramble: {
    type: "object",
    additionalProperties: false,
    required: ["words"],
    properties: {
      words: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["word", "hint"],
          properties: {
            word: { type: "string" },
            hint: { type: "string" },
          },
        },
      },
    },
  },
  sort: {
    type: "object",
    additionalProperties: false,
    required: ["categories", "items"],
    properties: {
      categories: { type: "array", items: { type: "string" } },
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "category"],
          properties: {
            label: { type: "string" },
            category: { type: "string" },
          },
        },
      },
    },
  },
  escape: {
    type: "object",
    additionalProperties: false,
    required: ["stages"],
    properties: {
      stages: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["clue", "options", "correctIndex", "hint"],
          properties: {
            clue: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correctIndex: { type: "integer" },
            hint: { type: "string" },
          },
        },
      },
    },
  },
  wordbuild: {
    type: "object",
    additionalProperties: false,
    required: ["puzzles"],
    properties: {
      puzzles: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["answer", "clue"],
          properties: {
            answer: { type: "string" },
            clue: { type: "string" },
          },
        },
      },
    },
  },
  battleship: {
    type: "object",
    additionalProperties: false,
    required: ["questions"],
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["question", "options", "correctIndex"],
          properties: {
            question: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            correctIndex: { type: "integer" },
          },
        },
      },
    },
  },
} as const;

export const PROMPTS = {
  quiz: "Create 5 multiple-choice quiz questions for this unit. Each question has exactly 4 options and one correct answer, with correctIndex between 0 and 3. Return JSON.",
  matching:
    "Create 4 matching pairs for this unit. Each pair has an id, a left term/concept and a right definition/example. Return JSON.",
  flashcards:
    "Create 6 flashcards for this unit. Each flashcard has a term and a concise definition. Return JSON.",
  speed:
    "Create 8 rapid-fire true/false statements for this unit. Each item has a statement, isTrue boolean, and a one-sentence explanation. Mix true and false. Return JSON.",
  scramble:
    "Create 6 key terms from this unit to unscramble. Each word must be a single word in UPPERCASE letters only (no spaces or hyphens), with a short hint. Return JSON.",
  sort:
    "Create a sorting game for this unit with exactly 3 categories and 9 items (3 per category). Each item has a label and a category that exactly matches one of the categories. Return JSON.",
  escape:
    "Create a 4-stage escape-room puzzle chain for this unit. Each stage has a clue framed as a lock, exactly 4 options, one correctIndex between 0 and 3, and a hint. Increase difficulty each stage. Return JSON.",
  wordbuild:
    "Create 5 word-building puzzles for this unit. Each answer must be a single UPPERCASE word (4-14 letters, no spaces or hyphens) with a clue. Return JSON.",
  battleship:
    "Create 8 multiple-choice questions for this unit to power a battleship game. Each question has exactly 4 options and one correctIndex between 0 and 3. Return JSON.",
} as const;

/** Error codes the client uses to drive credit-aware UX. */
export type GenerationErrorCode =
  | "CREDITS_EXHAUSTED"
  | "RATE_LIMITED"
  | "UNAVAILABLE"
  | "BAD_RESPONSE";

export function encodeGenerationError(code: GenerationErrorCode, message: string) {
  return new Error(`${code}: ${message}`);
}

export function decodeGenerationError(message: string): {
  code: GenerationErrorCode;
  message: string;
} {
  const match = message.match(
    /^(CREDITS_EXHAUSTED|RATE_LIMITED|UNAVAILABLE|BAD_RESPONSE): ([\s\S]*)$/,
  );
  if (!match) return { code: "UNAVAILABLE", message };
  return { code: match[1] as GenerationErrorCode, message: match[2] ?? message };
}

export function buildSystemPrompt(data: GenerateGameInputType): string {
  const topicsText = data.topics.join(", ");
  const objectivesText = data.objectives.trim()
    ? `The student's specific learning objectives are: ${data.objectives.trim()}. Every item must target those outcomes.`
    : "Focus on the unit's core learning objectives.";
  return `You are an expert curriculum instructional designer. Generate educational game content for ${data.courseCode} (${data.courseName}), unit: ${data.unitTitle}. Topics: ${topicsText}. ${DIFFICULTY_GUIDE[data.difficulty]} ${objectivesText} Content must be factually accurate, aligned to that course's curriculum, and age appropriate.`;
}

export async function callGateway(
  apiKey: string,
  system: string,
  prompt: string,
  name: keyof typeof JSON_SCHEMAS,
): Promise<unknown> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name, strict: true, schema: JSON_SCHEMAS[name] },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("AI gateway error", res.status, body);
    if (res.status === 429)
      throw encodeGenerationError("RATE_LIMITED", "Too many requests right now.");
    if (res.status === 402)
      throw encodeGenerationError("CREDITS_EXHAUSTED", "AI credits are exhausted.");
    throw encodeGenerationError("UNAVAILABLE", "The game generator is unavailable right now.");
  }

  const payload = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match)
      throw encodeGenerationError("BAD_RESPONSE", "The generator returned an unreadable response.");
    return JSON.parse(match[0]);
  }
}

export function parseGenerated(
  gameType: GenerateGameInputType["gameType"],
  raw: unknown,
): GeneratedGame {
  switch (gameType) {
    case "quiz":
      return { type: "quiz", questions: QuizSchema.parse(raw).questions };
    case "matching":
      return { type: "matching", pairs: MatchingSchema.parse(raw).pairs };
    case "flashcards":
      return { type: "flashcards", cards: FlashcardsSchema.parse(raw).cards };
    case "speed":
      return { type: "speed", items: SpeedSchema.parse(raw).items };
    case "scramble":
      return {
        type: "scramble",
        words: ScrambleSchema.parse(raw).words.map((w) => ({
          ...w,
          word: w.word.toUpperCase().replace(/[^A-Z]/g, ""),
        })),
      };
    case "sort":
      return { type: "sort", set: SortSchema.parse(raw) };
    case "escape":
      return { type: "escape", stages: EscapeSchema.parse(raw).stages };
    case "wordbuild":
      return {
        type: "wordbuild",
        puzzles: WordBuildSchema.parse(raw).puzzles.map((p) => ({
          ...p,
          answer: p.answer.toUpperCase(),
        })),
      };
    case "battleship":
      return { type: "battleship", questions: BattleshipSchema.parse(raw).questions };
  }
}

/** One full generation round-trip, shared by the server fn and the smoke tests. */
export async function generateGameContent(
  apiKey: string,
  data: GenerateGameInputType,
): Promise<GeneratedGame> {
  const raw = await callGateway(apiKey, buildSystemPrompt(data), PROMPTS[data.gameType], data.gameType);
  return parseGenerated(data.gameType, raw);
}
