import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { TripProvider } from "@/lib/trip-context";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh px-4">
      <div className="max-w-md text-center glass-strong rounded-3xl p-10 shadow-glow">
        <h1 className="text-7xl font-bold text-gradient-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This destination isn't on our map yet.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh px-4">
      <div className="max-w-md text-center glass-strong rounded-3xl p-10">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Traveloop — Plan smarter trips, together" },
      { name: "description", content: "Build personalized multi-city itineraries, track budgets, packing, and notes — all in one beautiful place." },
      { property: "og:title", content: "Traveloop — Plan smarter trips, together" },
      { property: "og:description", content: "Build personalized multi-city itineraries, track budgets, packing, and notes — all in one beautiful place." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Traveloop — Plan smarter trips, together" },
      { name: "twitter:description", content: "Build personalized multi-city itineraries, track budgets, packing, and notes — all in one beautiful place." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/757c75c4-98a2-46a8-aa8b-34a6248fba0b/id-preview-92e3b726--ebd6e76d-f35f-4662-b45b-28a614238ff6.lovable.app-1778404634655.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/757c75c4-98a2-46a8-aa8b-34a6248fba0b/id-preview-92e3b726--ebd6e76d-f35f-4662-b45b-28a614238ff6.lovable.app-1778404634655.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss }
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <TripProvider>
        <Outlet />
        <Toaster />
      </TripProvider>
    </QueryClientProvider>
  );
}
