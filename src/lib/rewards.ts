export interface Prize {
  id: string;
  title: string;
  blurb: string;
  cost: number;
  emoji: string;
  accent: string;
  certificateTitle: string;
  certificateLine: string;
}

export const PRIZES: Prize[] = [
  {
    id: "quiz-scholar",
    title: "Quiz Scholar",
    blurb: "For answering hundreds of curriculum questions with confidence.",
    cost: 250,
    emoji: "🧠",
    accent: "bg-accent-lavender",
    certificateTitle: "Certificate of Quiz Mastery",
    certificateLine: "has demonstrated outstanding recall and reasoning across Ontario curriculum quizzes.",
  },
  {
    id: "streak-star",
    title: "Streak Star",
    blurb: "Awarded for showing up and studying day after day.",
    cost: 400,
    emoji: "🔥",
    accent: "bg-accent-peach",
    certificateTitle: "Certificate of Consistency",
    certificateLine: "has maintained a remarkable daily learning streak on Curios T.",
  },
  {
    id: "unit-conqueror",
    title: "Unit Conqueror",
    blurb: "For finishing every game in a full course unit.",
    cost: 600,
    emoji: "🗺️",
    accent: "bg-accent-mint",
    certificateTitle: "Certificate of Unit Completion",
    certificateLine: "has completed an entire Ontario curriculum unit through interactive play.",
  },
  {
    id: "arcade-champion",
    title: "Arcade Champion",
    blurb: "Top scores across the fast-paced arcade game modes.",
    cost: 800,
    emoji: "🎮",
    accent: "bg-accent-sky",
    certificateTitle: "Certificate of Arcade Excellence",
    certificateLine: "has achieved champion-level scores in Curios T arcade learning challenges.",
  },
  {
    id: "curriculum-explorer",
    title: "Curriculum Explorer",
    blurb: "Generated games across three or more different courses.",
    cost: 1000,
    emoji: "🧭",
    accent: "bg-accent-lavender",
    certificateTitle: "Certificate of Curriculum Exploration",
    certificateLine: "has explored learning across multiple Ontario courses and subject areas.",
  },
  {
    id: "honour-roll",
    title: "Honour Roll",
    blurb: "The highest recognition on Curios T. Earned, not given.",
    cost: 1500,
    emoji: "🏅",
    accent: "bg-accent-peach",
    certificateTitle: "Certificate of Academic Distinction",
    certificateLine: "has reached the Curios T Honour Roll through sustained academic excellence.",
  },
];

export interface Redemption {
  id: string;
  prizeId: string;
  learnerName: string;
  redeemedAt: string;
  serial: string;
}

const XP_KEY = "curiost.xp";
const REDEEM_KEY = "curiost.redemptions";
const NAME_KEY = "curiost.learnerName";
const STARTING_XP = 1250;

function isBrowser() {
  return typeof window !== "undefined";
}

export function getXp(): number {
  if (!isBrowser()) return STARTING_XP;
  const raw = window.localStorage.getItem(XP_KEY);
  if (raw === null) {
    window.localStorage.setItem(XP_KEY, String(STARTING_XP));
    return STARTING_XP;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : STARTING_XP;
}

export function setXp(value: number) {
  if (!isBrowser()) return;
  window.localStorage.setItem(XP_KEY, String(Math.max(0, Math.round(value))));
}

export function getRedemptions(): Redemption[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(REDEEM_KEY);
    return raw ? (JSON.parse(raw) as Redemption[]) : [];
  } catch {
    return [];
  }
}

function saveRedemptions(list: Redemption[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(REDEEM_KEY, JSON.stringify(list));
}

export function getLearnerName(): string {
  if (!isBrowser()) return "";
  return window.localStorage.getItem(NAME_KEY) ?? "";
}

export function setLearnerName(name: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(NAME_KEY, name);
}

export function makeSerial(): string {
  return `CT-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now()
    .toString(36)
    .slice(-4)
    .toUpperCase()}`;
}

export function redeemPrize(prize: Prize, learnerName: string): Redemption {
  const redemption: Redemption = {
    id: `${prize.id}-${Date.now()}`,
    prizeId: prize.id,
    learnerName,
    redeemedAt: new Date().toISOString(),
    serial: makeSerial(),
  };
  setXp(getXp() - prize.cost);
  saveRedemptions([redemption, ...getRedemptions()]);
  return redemption;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
