import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm print:static print:bg-transparent print:p-0">
      <div className="w-full max-w-2xl">
        <div
          id="certificate"
          className="relative overflow-hidden rounded-[32px] border-4 border-primary/25 bg-card p-10 text-center shadow-lg md:p-14"
        >
          <div className="absolute inset-4 rounded-[24px] border border-dashed border-primary/20" />
          <div className="relative">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Curios T
            </p>
            <div className={`mx-auto mt-6 grid size-16 place-items-center rounded-2xl text-3xl ${prize.accent}`}>
              {prize.emoji}
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tighter md:text-4xl">
              {prize.certificateTitle}
            </h2>
            <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground">
              Presented to
            </p>
            <p className="mt-2 border-b border-foreground/10 pb-3 text-2xl font-extrabold tracking-tight">
              {redemption.learnerName}
            </p>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              {prize.certificateLine}
            </p>
            <div className="mt-10 flex items-end justify-between gap-6 text-left">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-muted-foreground">
                  Awarded
                </p>
                <p className="text-sm font-bold">{formatDate(redemption.redeemedAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold uppercase text-muted-foreground">
                  Serial
                </p>
                <p className="font-mono text-sm font-bold">{redemption.serial}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3 print:hidden">
          <Button
            onClick={() => window.print()}
            className="rounded-full px-6 py-5 text-sm font-bold"
          >
            Print / Save PDF
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="rounded-full px-6 py-5 text-sm font-bold"
          >
            Close
          </Button>
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
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter md:text-5xl">
          Prizes &amp; Certificates
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Turn the XP you earn playing curriculum games into printable certificates you can share
          with teachers, parents, or your portfolio.
        </p>
      </section>

      <div className="mb-10 rounded-3xl border border-foreground/5 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
              XP Balance
            </p>
            <p className="text-3xl font-extrabold tracking-tight">
              {ready ? xp.toLocaleString() : "—"} XP
            </p>
          </div>
          <div className="w-full md:max-w-xs">
            <label
              htmlFor="learner-name"
              className="mb-1 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Name on certificate
            </label>
            <Input
              id="learner-name"
              value={name}
              placeholder="e.g. Jordan Diaz"
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setLearnerName(name.trim())}
              className="rounded-full"
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
              className="animate-fade-up flex flex-col rounded-3xl border border-foreground/5 bg-card p-6 shadow-sm"
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              <div className={`grid size-14 place-items-center rounded-2xl text-2xl ${prize.accent}`}>
                {prize.emoji}
              </div>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight">{prize.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{prize.blurb}</p>

              <div className="mt-4">
                <Progress
                  value={Math.min(100, ready ? (xp / prize.cost) * 100 : 0)}
                  className="h-2"
                />
                <p className="mt-2 font-mono text-xs font-bold uppercase text-muted-foreground">
                  {prize.cost.toLocaleString()} XP
                </p>
              </div>

              <Button
                onClick={() => handleRedeem(prize)}
                disabled={!ready || !affordable}
                className="mt-4 rounded-full py-5 text-sm font-bold"
              >
                {affordable ? "Redeem certificate" : "Keep playing"}
              </Button>
            </div>
          );
        })}
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-tight">My certificates</h2>
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
                    variant="secondary"
                    onClick={() => setViewing(r)}
                    className="rounded-full px-5 text-sm font-bold"
                  >
                    View
                  </Button>
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
