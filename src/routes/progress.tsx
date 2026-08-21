import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PRIZES,
  downloadCertificate,
  formatDate,
  getRedemptions,
  getXp,
  getXpTimeline,
  type Redemption,
} from "@/lib/rewards";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress — Curios T" },
      {
        name: "description",
        content:
          "Track the XP you earn over time on Curios T and download every certificate you have unlocked.",
      },
      { property: "og:title", content: "My Progress — Curios T" },
      {
        property: "og:description",
        content:
          "Track the XP you earn over time on Curios T and download every certificate you have unlocked.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});

interface Point {
  date: string;
  balance: number;
  delta: number;
  reason: string;
}

function XpChart({ points }: { points: Point[] }) {
  const { path, area, max } = useMemo(() => {
    const w = 600;
    const h = 180;
    const values = points.map((p) => p.balance);
    const maxV = Math.max(1, ...values);
    const step = points.length > 1 ? w / (points.length - 1) : 0;
    const coords = points.map((p, i) => {
      const x = points.length > 1 ? i * step : w / 2;
      const y = h - (p.balance / maxV) * (h - 16) - 8;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return {
      path: `M${coords.join(" L")}`,
      area: `M0,${h} L${coords.join(" L")} L${w},${h} Z`,
      max: maxV,
    };
  }, [points]);

  return (
    <svg viewBox="0 0 600 180" className="h-48 w-full" role="img" aria-label="XP earned over time">
      <path d={area} className="fill-primary/10" />
      <path d={path} fill="none" strokeWidth="3" className="stroke-primary" strokeLinejoin="round" />
      <text x="4" y="14" className="fill-muted-foreground font-mono text-[10px]">
        {max.toLocaleString()} XP
      </text>
    </svg>
  );
}

function ProgressPage() {
  const [xp, setXp] = useState(0);
  const [timeline, setTimeline] = useState<Point[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setXp(getXp());
    setTimeline(getXpTimeline());
    setRedemptions(getRedemptions());
    setReady(true);
  }, []);

  const earned = timeline.filter((p) => p.delta > 0).reduce((s, p) => s + p.delta, 0);
  const spent = timeline.filter((p) => p.delta < 0).reduce((s, p) => s - p.delta, 0);
  const prizeById = (id: string) => PRIZES.find((p) => p.id === id);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter md:text-5xl">My Progress</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Your XP over time and every certificate you have unlocked — ready to download and share.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Current XP", ready ? xp.toLocaleString() : "—"],
          ["XP earned", ready ? earned.toLocaleString() : "—"],
          ["XP redeemed", ready ? spent.toLocaleString() : "—"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-foreground/5 bg-card p-6 shadow-sm">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-3xl border border-foreground/5 bg-card p-6 shadow-sm">
        <h2 className="text-xl font-extrabold tracking-tight">XP over time</h2>
        {timeline.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No XP activity recorded yet — play a game or redeem a prize and your history appears
            here.
          </p>
        ) : (
          <>
            <XpChart points={timeline} />
            <ul className="mt-4 space-y-2">
              {[...timeline].reverse().slice(0, 8).map((p, i) => (
                <li
                  key={`${p.date}-${i}`}
                  className="flex items-center justify-between rounded-xl bg-background/60 px-4 py-2 text-sm"
                >
                  <span className="font-semibold">{p.reason}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(p.date)} ·{" "}
                    <span className={p.delta >= 0 ? "text-primary" : ""}>
                      {p.delta >= 0 ? "+" : ""}
                      {p.delta} XP
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight">Certificates</h2>
          <Link to="/prizes" className="text-sm font-bold text-primary underline-offset-4 hover:underline">
            Browse prizes
          </Link>
        </div>
        {redemptions.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No certificates yet — redeem a prize to earn your first one.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {redemptions.map((r) => {
              const prize = prizeById(r.prizeId);
              if (!prize) return null;
              return (
                <div
                  key={r.id}
                  className="flex flex-col gap-3 rounded-2xl border border-foreground/5 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`grid size-11 place-items-center rounded-xl text-xl ${prize.accent}`}>
                      {prize.emoji}
                    </div>
                    <div>
                      <p className="font-extrabold tracking-tight">{prize.certificateTitle}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {r.learnerName} · {formatDate(r.redeemedAt)} · {r.serial}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => downloadCertificate(prize, r)}
                    className="rounded-full px-5 text-sm font-bold"
                  >
                    Download
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
