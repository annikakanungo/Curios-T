import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl font-bold text-foreground md:text-8xl">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Level not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="pixel-btn rounded-none px-4 py-2 text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="pixel-btn rounded-none px-4 py-2 text-sm"
          >
            Try again
          </button>
          <a
            href="/"
            className="pixel-btn-outline rounded-none px-4 py-2 text-sm"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Curios T — Play your way to mastery" },
      {
        name: "description",
        content:
          "Ontario curriculum-aligned educational games for K-12 students. Play quizzes, matching games, and flashcards built for the course unit you're studying.",
      },
      { name: "author", content: "Curios T" },
      { property: "og:title", content: "Curios T — Play your way to mastery" },
      {
        property: "og:description",
        content:
          "Ontario curriculum-aligned educational games for K-12 students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@CuriosT" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Work+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthControl() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();

  if (loading) return <div className="size-9 rounded-full border-4 border-foreground/10 bg-card" />;

  if (!user) {
    return (
      <Link
        to="/auth"
        search={{ redirect: "/generate" }}
        className="pixel-btn rounded-none px-4 py-2 text-xs"
      >
        Sign in
      </Link>
    );
  }

  const initials = (user.email ?? "?").slice(0, 2).toUpperCase();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", search: { redirect: "/generate" }, replace: true });
  };

  return (
    <div className="flex items-center gap-3">
      <div
        title={user.email ?? ""}
        className="grid size-9 place-items-center border-4 border-foreground bg-game-gold text-xs font-bold text-game-ink"
      >
        {initials}
      </div>
      <button
        onClick={signOut}
        className="text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign out
      </button>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b-4 border-foreground bg-card px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="font-display text-sm font-extrabold tracking-tighter text-primary md:text-base">
            CURIOS T
          </Link>
          <div className="hidden gap-4 text-xs font-bold uppercase tracking-wide text-muted-foreground md:flex">
            <Link
              to="/library"
              activeProps={{ className: "text-foreground" }}
              className="transition-colors hover:text-foreground"
            >
              Library
            </Link>
            <Link
              to="/quests"
              activeProps={{ className: "text-foreground" }}
              className="transition-colors hover:text-foreground"
            >
              Quests
            </Link>
            <Link
              to="/achievements"
              activeProps={{ className: "text-foreground" }}
              className="transition-colors hover:text-foreground"
            >
              Achievements
            </Link>
            <Link
              to="/prizes"
              activeProps={{ className: "text-foreground" }}
              className="transition-colors hover:text-foreground"
            >
              Prizes
            </Link>
            <Link
              to="/progress"
              activeProps={{ className: "text-foreground" }}
              className="transition-colors hover:text-foreground"
            >
              Progress
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 border-4 border-foreground bg-game-gold px-3 py-1 sm:flex">
            <span className="font-mono text-[10px] font-bold uppercase text-game-ink">7 Day Streak</span>
          </div>
          <AuthControl />
        </div>
      </div>
    </nav>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
