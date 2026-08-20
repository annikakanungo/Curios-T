import { createFileRoute, notFound } from "@tanstack/react-router";
import { getGameById, getGameContent, type Game } from "@/lib/games";
import {
  QuizGame,
  MatchingGame,
  FlashcardGame,
  SpeedGame,
  EscapeGame,
  WordBuildGame,
  BattleshipGame,
} from "@/components/games/GameShells";

type GameContent = ReturnType<typeof getGameContent>;

interface LoaderData {
  game: Game;
  content: GameContent;
}

export const Route = createFileRoute("/play/$gameId")({
  head: ({ params }) => ({
    meta: [
      { title: `Play ${params.gameId} — Curios T` },
      {
        name: "description",
        content: "Play an interactive educational game on Curios T.",
      },
      { property: "og:title", content: `Play ${params.gameId} — Curios T` },
      {
        property: "og:description",
        content: "Play an interactive educational game on Curios T.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ params }): Promise<LoaderData> => {
    const game = getGameById(params.gameId);
    if (!game) throw notFound();
    return { game, content: getGameContent(params.gameId) };
  },
  component: PlayPage,
});

function PlayPage() {
  const { game, content } = Route.useLoaderData() as LoaderData;

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
      ) : content.type === "quiz" ? (
        <QuizGame questions={content.questions} />
      ) : content.type === "matching" ? (
        <MatchingGame pairs={content.pairs} />
      ) : content.type === "flashcards" ? (
        <FlashcardGame cards={content.cards} />
      ) : content.type === "speed" ? (
        <SpeedGame items={content.items} />
      ) : content.type === "escape" ? (
        <EscapeGame stages={content.stages} />
      ) : content.type === "wordbuild" ? (
        <WordBuildGame puzzles={content.puzzles} />
      ) : (
        <BattleshipGame set={content.set} />
      )}
    </main>
  );
}
