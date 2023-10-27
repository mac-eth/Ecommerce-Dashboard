"use client";

import { ClerkProvider } from "@clerk/nextjs/app-beta/client";
import { dark, neobrutalism } from "@clerk/themes";
import { ThemeProvider } from "~/components/theme-provider";
import { env } from "~/env.mjs";
import { api } from "~/lib/api/client";

export function ClientProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider
        appearance={{}}
        publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <api.Provider>{children}</api.Provider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
