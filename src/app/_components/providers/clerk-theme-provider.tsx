// _components/providers/clerk-theme-provider.tsx
"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        variables: { colorPrimary: "hsl(var(--primary))" },
        elements: {
          card: "shadow-none",
          formButtonPrimary:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/90",
        },
        layout: {
          socialButtonsPlacement: "bottom",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
