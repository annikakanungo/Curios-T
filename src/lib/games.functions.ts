import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  GenerateGameInput,
  generateGameContent,
  encodeGenerationError,
  type GenerateGameInputType,
  type GeneratedGame,
} from "./game-generation";

export type { GeneratedGame } from "./game-generation";

export const generateGame = createServerFn({ method: "POST" })
  .inputValidator((input): GenerateGameInputType => GenerateGameInput.parse(input))
  .handler(async ({ data }): Promise<GeneratedGame> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw encodeGenerationError("UNAVAILABLE", "Missing LOVABLE_API_KEY");
    return generateGameContent(key, data);
  });
