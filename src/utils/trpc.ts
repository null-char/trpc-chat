import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../pages/api/trpc/[trpc]";
import superjson from "superjson";
import { env } from "./env";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  if (env.prod) {
    return `https://${env.VERCEL_URL}`;
  }

  return `http://localhost:${env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: getBaseUrl() + "/api/trpc",
        }),
      ],
      transformer: superjson,
    };
  },
  ssr: false,
});
