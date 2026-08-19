import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText, Output } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import type { QuizQuestion, MatchingPair, Flashcard } from "./games";

const GenerateGameInput = z.object({
  courseCode: z.string(),
  courseName: z.string(),
  unitTitle: z.string(),
  topics: z.array(z.string()),
  gameType: z.enum(["quiz", "matching", "flashcards"]),
});

const GeneratedQuizSchema = z.object({
  type: z.literal("quiz"),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctIndex: z.number().int().min(0).max(3),
    }),
  ),
});

const GeneratedMatchingSchema = z.object({
  type: z.literal("matching"),
  pairs: z.array(
    z.object({
      id: z.string(),
      left: z.string(),
      right: z.string(),
    }),
  ),
});

const GeneratedFlashcardsSchema = z.object({
  type: z.literal("flashcards"),
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

export const generateGame = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateGameInput.parse(input))
  .handler(async ({ data }): Promise<GeneratedGame> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) {
      throw new Error("Missing LOVABLE_API_KEY");
    }

    const gateway = createLovableAiGatewayProvider(key);
    const topicsText = data.topics.join(", ");

    const systemPrompt = `You are an expert Ontario curriculum instructional designer. Generate educational game content for ${data.courseCode} (${data.courseName}), unit: ${data.unitTitle}. Topics: ${topicsText}. The content must be accurate for the Ontario curriculum, age-appropriate for K-12, and focused on the unit's learning objectives.`;

    if (data.gameType === "quiz") {
      const { output } = await generateText({
        model: gateway("google/gemini-3.7-flash"),
        output: Output.object({ schema: GeneratedQuizSchema }),
        system: systemPrompt,
        prompt: `Create 5 multiple-choice quiz questions for this unit. Each question has 4 options and one correct answer. Return JSON matching the schema.`,
      });
      return output as GeneratedGame;
    }

    if (data.gameType === "matching") {
      const { output } = await generateText({
        model: gateway("google/gemini-3.7-flash"),
        output: Output.object({ schema: GeneratedMatchingSchema }),
        system: systemPrompt,
        prompt: `Create 4 matching pairs for this unit. Each pair has a left term/concept and a right definition/example. Return JSON matching the schema.`,
      });
      return output as GeneratedGame;
    }

    const { output } = await generateText({
      model: gateway("google/gemini-3.7-flash"),
      output: Output.object({ schema: GeneratedFlashcardsSchema }),
      system: systemPrompt,
      prompt: `Create 6 flashcards for this unit. Each flashcard has a term and a concise definition. Return JSON matching the schema.`,
    });
    return output as GeneratedGame;
  });
