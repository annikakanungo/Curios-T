import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/generate",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Curios T" },
      {
        name: "description",
        content: "Create a free Curios T account to generate curriculum-aligned study games.",
      },
      { property: "og:title", content: "Sign in — Curios T" },
      {
        property: "og:description",
        content: "Create a free Curios T account to generate curriculum-aligned study games.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate({ to: redirect as string });
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirect as string });
    });
    return () => subscription.unsubscribe();
  }, [navigate, redirect]);

  const handleEmail = async () => {
    if (!email.trim() || !password) {
      toast.error("Enter your email and a password.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirect}` },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-md flex-col px-6 py-16">
      <section className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A free Curios T account is required to generate study games.
        </p>
      </section>

      <div className="rounded-[32px] border border-foreground/5 bg-white p-8 shadow-sm">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-background/60 p-1">
          {(
            [
              ["signup", "Sign up"],
              ["signin", "Sign in"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                mode === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.ca"
              className="rounded-xl"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
              className="rounded-xl"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              onKeyDown={(e) => e.key === "Enter" && handleEmail()}
            />
          </div>

          <Button
            onClick={handleEmail}
            disabled={loading}
            className="w-full rounded-2xl py-6 text-base font-extrabold"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </Button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-foreground/10" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>

          <Button
            variant="outline"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full rounded-2xl py-6 text-base font-bold"
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </main>
  );
}
