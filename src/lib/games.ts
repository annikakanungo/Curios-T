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
  {
    id: "word-forge",
    title: "Word Forge",
    description: "Scrabble-style tile building — spell curriculum terms and score letter points.",
    subject: "Language",
    type: "wordbuild",
    level: 6,
    image: wordForgeImg,
    accent: "lavender",
  },
  {
    id: "concept-fleet",
    title: "Concept Fleet",
    description: "Battleship with brains — answer questions to fire on the hidden science fleet.",
    subject: "Life Sciences",
    type: "battleship",
    level: 9,
    image: conceptFleetImg,
    accent: "mint",
  },
  {
    id: "lightning-round",
    title: "Lightning Round",
    description: "45 seconds, true or false, streak multipliers. How fast can you think?",
    subject: "History",
    type: "speed",
    level: 5,
    image: lightningRoundImg,
    accent: "peach",
  },
  {
    id: "escape-lab",
    title: "Escape the Lab",
    description: "Crack a chain of clue locks to escape before the experiment goes wrong.",
    subject: "Chemistry",
    type: "escape",
    level: 8,
    image: escapeLabImg,
    accent: "lavender",
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

export const wordForgePuzzles: WordBuildPuzzle[] = [
  { answer: "PHOTOSYNTHESIS", clue: "How plants turn light into sugar." },
  { answer: "EQUATION", clue: "A statement that two expressions are equal." },
  { answer: "DEMOCRACY", clue: "Government by the people." },
  { answer: "MOLECULE", clue: "Two or more atoms bonded together." },
  { answer: "GRAVITY", clue: "The force pulling objects toward each other." },
];

export const conceptFleetSet: BattleshipSet = {
  size: 5,
  ships: [
    { name: "Cell Cruiser", cells: [2, 3] },
    { name: "Ecosystem Frigate", cells: [11, 16, 21] },
    { name: "DNA Destroyer", cells: [7, 8, 9] },
  ],
  questions: [
    {
      question: "Which organelle is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondrion", "Ribosome", "Vacuole"],
      correctIndex: 1,
    },
    {
      question: "What process do plants use to make food?",
      options: ["Respiration", "Digestion", "Photosynthesis", "Osmosis"],
      correctIndex: 2,
    },
    {
      question: "DNA is best described as…",
      options: [
        "A protein that stores energy",
        "The molecule carrying genetic instructions",
        "A type of cell membrane",
        "A waste product of respiration",
      ],
      correctIndex: 1,
    },
    {
      question: "Which organism is a producer in a food chain?",
      options: ["Hawk", "Grass", "Fox", "Mushroom"],
      correctIndex: 1,
    },
    {
      question: "What do we call the variety of life in an ecosystem?",
      options: ["Biodiversity", "Biomass", "Habitat", "Population"],
      correctIndex: 0,
    },
  ],
};

export const lightningRoundItems: SpeedItem[] = [
  {
    statement: "Confederation created the Dominion of Canada in 1867.",
    isTrue: true,
    explanation: "The British North America Act took effect July 1, 1867.",
  },
  {
    statement: "Ottawa was chosen as Canada's capital by Queen Victoria.",
    isTrue: true,
    explanation: "She selected Ottawa in 1857.",
  },
  {
    statement: "World War I ended in 1920.",
    isTrue: false,
    explanation: "The armistice was signed November 11, 1918.",
  },
  {
    statement: "The Underground Railroad brought freedom seekers into Canada.",
    isTrue: true,
    explanation: "Thousands reached Upper Canada before the U.S. Civil War.",
  },
  {
    statement: "Nunavut became a territory in 1949.",
    isTrue: false,
    explanation: "Nunavut was created in 1999.",
  },
  {
    statement: "The Great Depression began with the 1929 stock market crash.",
    isTrue: true,
    explanation: "Markets collapsed in October 1929.",
  },
];

export const escapeLabStages: EscapeStage[] = [
  {
    clue: "Lock 1: The pH meter reads 2. What kind of solution is in the beaker?",
    options: ["Acidic", "Neutral", "Basic", "Saturated"],
    correctIndex: 0,
    hint: "pH below 7 means more hydrogen ions.",
  },
  {
    clue: "Lock 2: Which gas is released when magnesium reacts with hydrochloric acid?",
    options: ["Oxygen", "Hydrogen", "Chlorine", "Nitrogen"],
    correctIndex: 1,
    hint: "It goes 'pop' with a lit splint.",
  },
  {
    clue: "Lock 3: The balanced equation 2H₂ + O₂ → ? produces…",
    options: ["2H₂O", "H₂O₂", "HO₂", "H₄O₂"],
    correctIndex: 0,
    hint: "Count atoms on both sides.",
  },
  {
    clue: "Final door: Which lab rule keeps the exit safe?",
    options: [
      "Pour waste down the sink",
      "Leave goggles off to see better",
      "Know the location of the fire blanket and eyewash",
      "Taste chemicals to identify them",
    ],
    correctIndex: 2,
    hint: "Safety equipment first.",
  },
];

}
