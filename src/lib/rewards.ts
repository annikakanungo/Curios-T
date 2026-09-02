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
    accent: "bg-game-blue/25",
    certificateTitle: "Certificate of Quiz Mastery",
    certificateLine: "has demonstrated outstanding recall and reasoning across Ontario curriculum quizzes.",
  },
  {
    id: "streak-star",
    title: "Streak Star",
    blurb: "Awarded for showing up and studying day after day.",
    cost: 400,
    emoji: "🔥",
    accent: "bg-game-gold/30",
    certificateTitle: "Certificate of Consistency",
    certificateLine: "has maintained a remarkable daily learning streak on Curios T.",
  },
  {
    id: "unit-conqueror",
    title: "Unit Conqueror",
    blurb: "For finishing every game in a full course unit.",
    cost: 600,
    emoji: "🗺️",
    accent: "bg-game-green/25",
    certificateTitle: "Certificate of Unit Completion",
    certificateLine: "has completed an entire Ontario curriculum unit through interactive play.",
  },
  {
    id: "arcade-champion",
    title: "Arcade Champion",
    blurb: "Top scores across the fast-paced arcade game modes.",
    cost: 800,
    emoji: "🎮",
    accent: "bg-game-red/25",
    certificateTitle: "Certificate of Arcade Excellence",
    certificateLine: "has achieved champion-level scores in Curios T arcade learning challenges.",
  },
  {
    id: "curriculum-explorer",
    title: "Curriculum Explorer",
    blurb: "Generated games across three or more different courses.",
    cost: 1000,
    emoji: "🧭",
    accent: "bg-game-blue/25",
    certificateTitle: "Certificate of Curriculum Exploration",
    certificateLine: "has explored learning across multiple Ontario courses and subject areas.",
  },
  {
    id: "honour-roll",
    title: "Honour Roll",
    blurb: "The highest recognition on Curios T. Earned, not given.",
    cost: 1500,
    emoji: "🏅",
    accent: "bg-game-gold/30",
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
const XP_EVENTS_KEY = "curiost.xpEvents";
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

export interface XpEvent {
  id: string;
  amount: number;
  reason: string;
  at: string;
}

export function getXpEvents(): XpEvent[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(XP_EVENTS_KEY);
    return raw ? (JSON.parse(raw) as XpEvent[]) : [];
  } catch {
    return [];
  }
}

export function logXpEvent(amount: number, reason: string): XpEvent {
  const event: XpEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    amount,
    reason,
    at: new Date().toISOString(),
  };
  if (isBrowser()) {
    window.localStorage.setItem(XP_EVENTS_KEY, JSON.stringify([...getXpEvents(), event]));
  }
  return event;
}

export function awardXp(amount: number, reason: string) {
  setXp(getXp() + amount);
  logXpEvent(amount, reason);
}

/** Cumulative XP balance over time, oldest first. */
export function getXpTimeline(): { date: string; balance: number; delta: number; reason: string }[] {
  const events = getXpEvents();
  const spent = events.reduce((sum, e) => sum + e.amount, 0);
  let running = getXp() - spent;
  return events.map((e) => {
    running += e.amount;
    return { date: e.at, balance: running, delta: e.amount, reason: e.reason };
  });
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
  logXpEvent(-prize.cost, `Redeemed ${prize.title}`);
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

export function certificateHtml(prize: Prize, redemption: Redemption): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>${prize.certificateTitle} — ${redemption.learnerName}</title>
<style>
  body{font-family:Inter,system-ui,sans-serif;background:#faf8f4;display:grid;place-items:center;min-height:100vh;margin:0;padding:32px}
  .cert{background:#fff;border:6px solid #d9d2ff;border-radius:28px;padding:56px;max-width:720px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.06)}
  .brand{font-family:'JetBrains Mono',monospace;letter-spacing:.3em;text-transform:uppercase;font-size:12px;color:#6b5bd2}
  h1{font-size:34px;margin:24px 0 8px;letter-spacing:-.02em}
  .name{font-size:26px;font-weight:800;border-bottom:1px solid #eee;padding-bottom:12px;margin:24px auto;max-width:420px}
  .line{color:#666;line-height:1.6;max-width:480px;margin:0 auto}
  .meta{display:flex;justify-content:space-between;margin-top:48px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#666}
</style></head>
<body><div class="cert">
  <div class="brand">Curios T</div>
  <div style="font-size:44px">${prize.emoji}</div>
  <h1>${prize.certificateTitle}</h1>
  <p style="text-transform:uppercase;letter-spacing:.2em;font-size:12px;color:#888">Presented to</p>
  <div class="name">${redemption.learnerName}</div>
  <p class="line">${prize.certificateLine}</p>
  <div class="meta"><span>Awarded ${formatDate(redemption.redeemedAt)}</span><span>Serial ${redemption.serial}</span></div>
</div></body></html>`;
}

export function downloadCertificate(prize: Prize, redemption: Redemption) {
  if (!isBrowser()) return;
  const blob = new Blob([certificateHtml(prize, redemption)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `curios-t-${prize.id}-${redemption.serial}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
