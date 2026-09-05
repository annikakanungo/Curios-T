import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Curios T" },
      {
        name: "description",
        content:
          "Curios T privacy policy: how we handle student data, accounts, and personal information.",
      },
      { property: "og:title", content: "Privacy Policy — Curios T" },
      {
        property: "og:description",
        content:
          "How Curios T collects, uses, and protects your personal information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="pixel-card bg-card p-6 md:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-10 place-items-center border-4 border-foreground bg-game-blue text-xs font-bold text-white">
              P
            </div>
            <h1 className="font-display text-lg leading-tight text-foreground md:text-xl">
              PRIVACY POLICY
            </h1>
          </div>

          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Last updated: September 5, 2026. This policy explains how{" "}
            <strong className="text-foreground">Curios T</strong> handles your
            personal information when you use our educational games platform.
          </p>

          <section className="mb-6">
            <h2 className="mb-2 font-display text-xs uppercase text-primary">
              1. What we collect
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              When you create an account, we collect your email address and a
              secure password hash through our authentication provider. We also
              store your game progress, XP, streaks, achievements, and redeemed
              certificates so you can pick up where you left off.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 font-display text-xs uppercase text-primary">
              2. How we use your info
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use your information to provide personalized learning games,
              track your progress, award certificates, and improve the app. We
              do <strong className="text-foreground">not</strong> sell your
              personal data to third parties.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 font-display text-xs uppercase text-primary">
              3. AI-generated content
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Games are generated with AI based on the curriculum details you
              provide. We do not store the raw prompts you type, but we may log
              anonymized generation requests to improve quality and reliability.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 font-display text-xs uppercase text-primary">
              4. Cookies & local storage
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use browser local storage to remember your session and game
              state. Our authentication provider may use essential cookies to
              keep you signed in securely.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 font-display text-xs uppercase text-primary">
              5. Your choices
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You can sign out at any time from the navigation bar. To delete
              your account and all associated data, please contact us at{" "}
              <a
                href="mailto:privacy@curiost.app"
                className="font-bold text-primary underline decoration-2 underline-offset-2"
              >
                privacy@curiost.app
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-2 font-display text-xs uppercase text-primary">
              6. Changes to this policy
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We may update this policy as the app grows. If we make material
              changes, we will notify you by updating the date above.
            </p>
          </section>

          <div className="flex flex-wrap items-center gap-3 border-t-4 border-dashed border-border pt-6">
            <Link
              to="/"
              className="pixel-btn rounded-none px-4 py-2 text-xs"
            >
              Return to base
            </Link>
            <Link
              to="/generate"
              className="pixel-btn-outline rounded-none px-4 py-2 text-xs"
            >
              Start a mission
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
