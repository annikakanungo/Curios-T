import { PRIZES, formatDate, type Redemption } from "./rewards";

export interface TimelinePoint {
  date: string;
  balance: number;
  delta: number;
  reason: string;
}

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildProgressCsv(timeline: TimelinePoint[], redemptions: Redemption[]): string {
  const rows: (string | number)[][] = [
    ["Section", "Date", "Item", "XP change", "XP balance", "Learner", "Serial"],
  ];

  for (const p of timeline) {
    rows.push(["XP timeline", p.date, p.reason, p.delta, p.balance, "", ""]);
  }

  for (const r of redemptions) {
    const prize = PRIZES.find((p) => p.id === r.prizeId);
    rows.push([
      "Certificate",
      r.redeemedAt,
      prize?.certificateTitle ?? r.prizeId,
      prize ? -prize.cost : "",
      "",
      r.learnerName,
      r.serial,
    ]);
  }

  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function download(filename: string, content: string, mime: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadProgressCsv(timeline: TimelinePoint[], redemptions: Redemption[]) {
  const stamp = new Date().toISOString().slice(0, 10);
  download(
    `curios-t-progress-${stamp}.csv`,
    buildProgressCsv(timeline, redemptions),
    "text/csv;charset=utf-8",
  );
}

export function progressReportHtml(
  xp: number,
  timeline: TimelinePoint[],
  redemptions: Redemption[],
): string {
  const earned = timeline.filter((p) => p.delta > 0).reduce((s, p) => s + p.delta, 0);
  const spent = timeline.filter((p) => p.delta < 0).reduce((s, p) => s - p.delta, 0);
  const rows = [...timeline]
    .reverse()
    .map(
      (p) =>
        `<tr><td>${formatDate(p.date)}</td><td>${p.reason}</td><td class="num">${
          p.delta >= 0 ? "+" : ""
        }${p.delta}</td><td class="num">${p.balance}</td></tr>`,
    )
    .join("");
  const certs = redemptions
    .map((r) => {
      const prize = PRIZES.find((p) => p.id === r.prizeId);
      return `<tr><td>${formatDate(r.redeemedAt)}</td><td>${
        prize?.certificateTitle ?? r.prizeId
      }</td><td>${r.learnerName}</td><td class="num">${r.serial}</td></tr>`;
    })
    .join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<title>Curios T — Progress Report</title>
<style>
  body{font-family:Inter,system-ui,sans-serif;color:#1c1a17;margin:0;padding:40px;background:#fff}
  h1{letter-spacing:-.03em;margin:8px 0 4px;font-size:30px}
  .brand{font-family:'JetBrains Mono',monospace;letter-spacing:.3em;text-transform:uppercase;font-size:11px;color:#6b5bd2}
  .stats{display:flex;gap:16px;margin:24px 0}
  .stat{flex:1;border:1px solid #eee;border-radius:16px;padding:16px}
  .stat span{display:block;font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#777}
  .stat b{font-size:24px}
  h2{font-size:18px;margin-top:32px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{text-align:left;padding:8px 6px;border-bottom:1px solid #f0eee9}
  th{font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#777}
  .num{text-align:right;font-family:'JetBrains Mono',monospace}
  @media print{body{padding:0}}
</style></head><body>
<div class="brand">Curios T</div>
<h1>Progress Report</h1>
<p style="color:#666;font-size:13px">Generated ${formatDate(new Date().toISOString())}</p>
<div class="stats">
  <div class="stat"><span>Current XP</span><b>${xp.toLocaleString()}</b></div>
  <div class="stat"><span>XP earned</span><b>${earned.toLocaleString()}</b></div>
  <div class="stat"><span>XP redeemed</span><b>${spent.toLocaleString()}</b></div>
</div>
<h2>XP timeline</h2>
<table><thead><tr><th>Date</th><th>Activity</th><th class="num">Change</th><th class="num">Balance</th></tr></thead>
<tbody>${rows || '<tr><td colspan="4">No XP activity yet.</td></tr>'}</tbody></table>
<h2>Certificates</h2>
<table><thead><tr><th>Date</th><th>Certificate</th><th>Learner</th><th class="num">Serial</th></tr></thead>
<tbody>${certs || '<tr><td colspan="4">No certificates redeemed yet.</td></tr>'}</tbody></table>
<script>window.onload=function(){setTimeout(function(){window.print()},250)}<\/script>
</body></html>`;
}

/** Opens a print-ready report the browser can save as PDF. */
export function downloadProgressPdf(
  xp: number,
  timeline: TimelinePoint[],
  redemptions: Redemption[],
) {
  if (typeof window === "undefined") return;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(progressReportHtml(xp, timeline, redemptions));
  win.document.close();
}
