import orbitMatchImg from "@/assets/orbit-match.jpg";
import reactionLabImg from "@/assets/reaction-lab.jpg";
import equationStackImg from "@/assets/equation-stack.jpg";
import wordForgeImg from "@/assets/word-forge.jpg";
import conceptFleetImg from "@/assets/concept-fleet.jpg";
import lightningRoundImg from "@/assets/lightning-round.jpg";
import escapeLabImg from "@/assets/escape-lab.jpg";

export type GameType =
  | "quiz"
  | "matching"
  | "flashcards"
  | "speed"
  | "scramble"
  | "sort"
  | "escape"
  | "wordbuild"
  | "battleship";
export type Subject =
  | "Mathematics"
  | "Life Sciences"
  | "Astronomy"
  | "Chemistry"
  | "History"
  | "Language";


export interface Game {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  type: GameType;
  level: number;
  image: string;
  accent: "lavender" | "mint" | "peach";
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface SpeedItem {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface ScrambleWord {
  word: string;
  hint: string;
}

export interface SortBucketSet {
  categories: string[];
  items: { label: string; category: string }[];
}

export interface EscapeStage {
  clue: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export interface WordBuildPuzzle {
  answer: string;
  clue: string;
  bonusLetters?: string[];
}

export interface BattleshipSet {
  size: number;
  ships: { name: string; cells: number[] }[];
  questions: QuizQuestion[];
}


export const games: Game[] = [
  {
    id: "orbit-match",
    title: "Orbit Match",
    description: "Master gravitational patterns by matching planetary pairs in deep space.",
    subject: "Astronomy",
    type: "matching",
    level: 4,
    image: orbitMatchImg,
    accent: "lavender",
  },
  {
    id: "reaction-lab",
    title: "Reaction Lab",
    description: "Identify chemical elements through rapid-fire visual quizzes and puzzles.",
    subject: "Chemistry",
    type: "quiz",
    level: 12,
    image: reactionLabImg,
    accent: "mint",
  },
  {
    id: "equation-stack",
    title: "Equation Stack",
    description: "Build tower stability by solving arithmetic challenges against the clock.",
    subject: "Mathematics",
    type: "flashcards",
    level: 2,
    image: equationStackImg,
    accent: "peach",
  },
];

export const orbitMatchPairs: MatchingPair[] = [
  { id: "1", left: "Mercury", right: "Closest to the Sun" },
  { id: "2", left: "Venus", right: "Hottest planet" },
  { id: "3", left: "Earth", right: "Only known life" },
  { id: "4", left: "Mars", right: "Red planet" },
];

export const reactionLabQuestions: QuizQuestion[] = [
  {
    question: "Which element has the chemical symbol O?",
    options: ["Osmium", "Oxygen", "Ozone", "Opal"],
    correctIndex: 1,
  },
  {
    question: "What is the pH of pure water at 25°C?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
  },
  {
    question: "Which gas makes up most of Earth's atmosphere?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    correctIndex: 2,
  },
];

export const equationStackFlashcards: Flashcard[] = [
  { term: "12 × 4", definition: "48" },
  { term: "8 × 7", definition: "56" },
  { term: "15 + 29", definition: "44" },
  { term: "100 ÷ 25", definition: "4" },
];

export function getGameById(id: string): Game | undefined {
  return games.find((g) => g.id === id);
}

export function getGameContent(id: string) {
  switch (id) {
    case "orbit-match":
      return { type: "matching" as const, pairs: orbitMatchPairs };
    case "reaction-lab":
      return { type: "quiz" as const, questions: reactionLabQuestions };
    case "equation-stack":
      return { type: "flashcards" as const, cards: equationStackFlashcards };
    default:
      return null;
  }
}
