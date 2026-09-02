import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  PRIZES,
  formatDate,
  getLearnerName,
  getRedemptions,
  getXp,
  redeemPrize,
  setLearnerName,
  type Prize,
  type Redemption,
} from "@/lib/rewards";

export const Route = createFileRoute("/prizes")({
  head: () => ({
    meta: [
      { title: "Prizes & Certificates — Curios T" },
      {
        name: "description",
        content:
          "Redeem the XP you earn from Curios T games for printable achievement certificates.",
      },
      { property: "og:title", content: "Prizes & Certificates — Curios T" },
      {
        property: "og:description",
        content:
          "Redeem the XP you earn from Curios T games for printable achievement certificates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrizesPage,
});

function PixelBar({ value }: { value: number }) {
  const cells = 16;
  const filled = Math.round((Math.min(100, value) / 100) * cells);
  return (
    <div className="flex gap-1 border-4 border-foreground bg-background p-1">
      {Array.from({ length: cells }).map((_, i) => (
        <div key={i} className={`h-2.5 flex-1 ${i < filled ? "bg-game-gold" : "bg-muted"}`} />
      ))}
    </div>
  );
}

function Certificate({
  prize,
  redemption,
  onClose,
}: {
  prize: Prize;
  redemption: Redemption;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/60 p-4 print:static print:bg-transparent print:p-0">
      <div className="w-full max-w-2xl">
        <div
          id="certificate"
          className="relative overflow-hidden border-[6px] border-foreground bg-card p-10 text-center md:p-14"
          style={{ boxShadow: "10px 10px 0 0 var(--color-game-shadow)" }}
        >
          <div className="absolute inset-3 border-4 border-dashed border-primary/40" />
          <div className="relative">
            <p className="font-display text-[10px] text-primary">CURIOS T</p>
            <div
              className={`mx-auto mt-6 grid size-16 place-items-center border-4 border-foreground text-3xl ${prize.accent}`}
            >
              {prize.emoji}
            </div>
            <h2 className="mt-6 font-display text-sm leading-relaxed md:text-lg md:leading-relaxed">
              {prize.certificateTitle}
            </h2>
            <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Presented to
            </p>
            <p className="mt-2 border-b-4 border-foreground pb-3 text-2xl font-extrabold tracking-tight">
              {redemption.learnerName}
            </p>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              {prize.certificateLine}
            </p>
            <div className="mt-10 flex items-end justify-between gap-6 text-left">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  Awarded
                </p>
                <p className="text-sm font-bold">{formatDate(redemption.redeemedAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  Serial
                </p>
                <p className="font-mono text-sm font-bold">{redemption.serial}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="pixel-btn rounded-none px-6 py-3 font-display text-[9px]"
          >
            PRINT / PDF
          </button>
          <button
            onClick={onClose}
            className="pixel-btn-outline rounded-none px-6 py-3 font-display text-[9px]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

function PrizesPage() {
  const [xp, setXpState] = useState(0);
  const [name, setName] = useState("");
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [viewing, setViewing] = useState<Redemption | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setXpState(getXp());
    setName(getLearnerName());
    setRedemptions(getRedemptions());
    setReady(true);
  }, []);

  const handleRedeem = (prize: Prize) => {
    const learner = name.trim();
    if (!learner) {
      toast.error("Add the name that should appear on the certificate first.");
      return;
    }
    if (xp < prize.cost) {
      toast.error(`You need ${prize.cost - xp} more XP for ${prize.title}.`);
      return;
    }
    setLearnerName(learner);
    const redemption = redeemPrize(prize, learner);
    setXpState(getXp());
    setRedemptions(getRedemptions());
    setViewing(redemption);
    toast.success(`${prize.title} unlocked — your certificate is ready!`);
  };

  const prizeById = (id: string) => PRIZES.find((p) => p.id === id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <section className="hud-panel scanlines mb-8 p-6 md:p-8">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          ▮ REWARD TERMINAL
        </span>
        <h1 className="mt-3 font-display text-xl leading-relaxed md:text-3xl md:leading-relaxed">
          PRIZES
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Turn earned XP into printable certificates you can share with teachers, parents, or your
          portfolio.
        </p>
      </section>

      <div className="hud-panel mb-8 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              XP Balance
            </p>
            <p className="mt-2 font-display text-lg text-game-gold">
              {ready ? xp.toLocaleString() : "—"} XP
            </p>
          </div>
          <div className="w-full md:max-w-xs">
            <label
              htmlFor="learner-name"
              className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            >
              Name on certificate
            </label>
            <Input
              id="learner-name"
              value={name}
              placeholder="e.g. Jordan Diaz"
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setLearnerName(name.trim())}
              className="rounded-none border-4 border-foreground"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRIZES.map((prize, idx) => {
          const affordable = xp >= prize.cost;
          return (
            <div
              key={prize.id}
              className="hud-panel animate-fade-up flex flex-col p-6"
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              <div
                className={`grid size-14 place-items-center border-4 border-foreground text-2xl ${prize.accent}`}
              >
                {prize.emoji}
              </div>
              <h2 className="mt-4 text-base font-extrabold tracking-tight">{prize.title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{prize.blurb}</p>

              <div className="mt-4">
                <PixelBar value={ready ? (xp / prize.cost) * 100 : 0} />
                <p className="mt-2 font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  {prize.cost.toLocaleString()} XP
                </p>
              </div>

              <button
                onClick={() => handleRedeem(prize)}
                disabled={!ready || !affordable}
                className="pixel-btn mt-4 rounded-none px-4 py-3 font-display text-[9px]"
              >
                {affordable ? "REDEEM" : "KEEP PLAYING"}
              </button>
            </div>
          );
        })}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-sm">MY CERTIFICATES</h2>
        {redemptions.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No certificates yet — redeem a prize above to earn your first one.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {redemptions.map((r) => {
              const prize = prizeById(r.prizeId);
              if (!prize) return null;
              return (
                <div
                  key={r.id}
                  className="hud-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`grid size-11 place-items-center border-4 border-foreground text-xl ${prize.accent}`}
                    >
                      {prize.emoji}
                    </div>
                    <div>
                      <p className="font-extrabold tracking-tight">{prize.certificateTitle}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {r.learnerName} · {formatDate(r.redeemedAt)} · {r.serial}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewing(r)}
                    className="pixel-btn-outline rounded-none px-5 py-2 font-display text-[9px]"
                  >
                    VIEW
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {viewing && prizeById(viewing.prizeId) && (
        <Certificate
          prize={prizeById(viewing.prizeId)!}
          redemption={viewing}
          onClose={() => setViewing(null)}
        />
      )}
    </main>
  );
}
