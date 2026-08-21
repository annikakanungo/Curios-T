import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { QuizQuestion, MatchingPair, Flashcard } from "./games";

const GenerateGameInput = z.object({
  courseCode: z.string(),
  courseName: z.string(),
  unitTitle: z.string(),
  topics: z.array(z.string()),
  gameType: z.enum(["quiz", "matching", "flashcards"]),
  difficulty: z.enum(["intro", "standard", "challenge", "exam"]).default("standard"),
  objectives: z.string().max(500).default(""),
});

const DIFFICULTY_GUIDE: Record<string, string> = {
  intro: "Introductory level: recall and basic understanding, simple wording, one-step reasoning.",
  standard: "Standard course level: solid understanding and application, typical classwork difficulty.",
  challenge: "Challenge level: multi-step reasoning, analysis, and less obvious distractors.",
  exam: "Exam level: rigorous, exam-style items testing synthesis, evaluation, and precise terminology.",
};

const QuizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number(),
    }),
  ),
});

const MatchingSchema = z.object({
  pairs: z.array(
    z.object({
      id: z.string(),
      left: z.string(),
      right: z.string(),
    }),
  ),
});

const FlashcardsSchema = z.object({
  cards: z.array(
    z.object({
      term: z.string(),
      definition: z.string(),
    }),
  ),
});

export type GeneratedGame =
  | { type: "quiz"; questions: QuizQuestion[] }
  | { type: "matching"; pairs: MatchingPair[] }
  | { type: "flashcards"; cards: Flashcard[] };

const JSON_SCHEMAS = {
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
} as const;

const PROMPTS = {
  quiz: "Create 5 multiple-choice quiz questions for this unit. Each question has exactly 4 options and one correct answer, with correctIndex between 0 and 3. Return JSON.",
  matching:
    "Create 4 matching pairs for this unit. Each pair has an id, a left term/concept and a right definition/example. Return JSON.",
  flashcards:
    "Create 6 flashcards for this unit. Each flashcard has a term and a concise definition. Return JSON.",
} as const;

async function callGateway(
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
    if (res.status === 429) throw new Error("Too many requests right now — try again in a moment.");
    if (res.status === 402) throw new Error("AI credits are exhausted for this workspace.");
    throw new Error("The game generator is unavailable right now.");
  }

  const payload = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("The generator returned an unreadable response.");
    return JSON.parse(match[0]);
  }
}

export const generateGame = createServerFn({ method: "POST" })
  .inputValidator((input): z.infer<typeof GenerateGameInput> => GenerateGameInput.parse(input))
  .handler(async ({ data }): Promise<GeneratedGame> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const topicsText = data.topics.join(", ");
    const objectivesText = data.objectives.trim()
      ? `The student's specific learning objectives are: ${data.objectives.trim()}. Every item must target those outcomes.`
      : "Focus on the unit's core learning objectives.";
    const system = `You are an expert curriculum instructional designer. Generate educational game content for ${data.courseCode} (${data.courseName}), unit: ${data.unitTitle}. Topics: ${topicsText}. ${DIFFICULTY_GUIDE[data.difficulty]} ${objectivesText} Content must be factually accurate, aligned to that course's curriculum, and age appropriate.`;

    const raw = await callGateway(key, system, PROMPTS[data.gameType], data.gameType);

    if (data.gameType === "quiz") {
      return { type: "quiz", questions: QuizSchema.parse(raw).questions };
    }
    if (data.gameType === "matching") {
      return { type: "matching", pairs: MatchingSchema.parse(raw).pairs };
    }
    return { type: "flashcards", cards: FlashcardsSchema.parse(raw).cards };
  });
