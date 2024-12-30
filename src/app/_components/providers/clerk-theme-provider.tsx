// _components/providers/clerk-theme-provider.tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import type { Appearance } from "@clerk/types";

const baseAppearance: Appearance = {
  elements: {
    card: "shadow-none",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
    footerActionLink: "text-primary hover:text-primary/90",
  },
  layout: {
    socialButtonsPlacement: "bottom" as const,
  },
};

export function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const appearance: Appearance = {
    ...baseAppearance,
    baseTheme: mounted && resolvedTheme === "dark" ? dark : undefined,
  };

  return (
    <div suppressHydrationWarning>
      <ClerkProvider appearance={appearance}>{children}</ClerkProvider>
    </div>
  );
}
