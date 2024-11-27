// src/components/layout/main-nav.tsx
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function MainNav() {
  const linkStyle =
    "p-2 text-sm font-medium transition-colors hover:bg-slate-600 hover:text-white rounded-md";
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-2 flex h-14 p-3">
        <div className="mr-4 flex justify-center">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 rounded-md px-4 py-2 hover:bg-slate-600 hover:text-white"
          >
            <span className="font-bold">MealPlanner</span>
          </Link>
        </div>
        <SignedIn>
          <nav className="flex flex-1 items-center space-x-4">
            <Link href="/meal-plans" className={linkStyle}>
              Meal Plans
            </Link>
            <Link href="/recipes" className={linkStyle}>
              Recipes
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <UserButton showName={true} />
          </div>
        </SignedIn>
        <SignedOut>
          <div className="ml-auto flex items-center space-x-4">
            <SignInButton />
          </div>
        </SignedOut>
      </div>
    </header>
  );
}
