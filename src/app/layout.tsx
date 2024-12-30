import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { MainNav } from "./_components/layout/main-nav";
import { ThemeProvider } from "./_components/providers/theme-provider";
import { ClerkThemeProvider } from "./_components/providers/clerk-theme-provider";

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Plan your meals and organize your recipes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
            storageKey="meal-planner-theme"
          >
            <ClerkThemeProvider>
              <div className="relative flex min-h-screen flex-col p-3">
                <MainNav />
                <main className="mx-auto flex-1">
                  <div className="container py-6">{children}</div>
                </main>
              </div>
            </ClerkThemeProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
