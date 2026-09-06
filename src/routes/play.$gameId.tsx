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
  head: ({ params, loaderData }) => {
    const game = loaderData?.game;
    const content = loaderData?.content;
    const title = game ? `${game.title} — ${game.type} game — Curios T` : "Play — Curios T";
    const description = game
      ? `${game.description} A ${game.type} game for ${game.subject} (level ${game.level}) on Curios T.`
      : "Play an interactive educational game on Curios T.";
    const url = `https://curios-t.lovable.app/play/${params.gameId}`;

    const scripts =
      content && content.type === "quiz"
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Quiz",
                name: game?.title,
                about: { "@type": "Thing", name: game?.subject },
                educationalLevel: `Level ${game?.level}`,
                url,
                hasPart: content.questions.map((q) => ({
                  "@type": "Question",
                  eduQuestionType: "Multiple choice",
                  text: q.question,
                  acceptedAnswer: { "@type": "Answer", text: q.options[q.correctIndex] },
                  suggestedAnswer: q.options
                    .filter((_, i) => i !== q.correctIndex)
                    .map((option) => ({ "@type": "Answer", text: option })),
                })),
              }),
            },
          ]
        : undefined;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      ...(scripts ? { scripts } : {}),
    };
  },
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
