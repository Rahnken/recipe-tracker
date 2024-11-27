// src/app/page.tsx
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col items-center justify-center space-y-12 text-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Plan Your Meals, Simplify Your Life
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          Generate meal plans, organize recipes, and create shopping lists all
          in one place.
        </p>
        {!userId && (
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/sign-in">Get Started</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Meal Planning</CardTitle>
            <CardDescription>
              Create and manage your weekly meal plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            Plan your meals for the week with our easy-to-use interface
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipe Management</CardTitle>
            <CardDescription>
              Store and organize your favorite recipes
            </CardDescription>
          </CardHeader>
          <CardContent>
            Keep all your recipes in one place and easily add them to your meal
            plans
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shopping Lists</CardTitle>
            <CardDescription>
              Automatically generate shopping lists
            </CardDescription>
          </CardHeader>
          <CardContent>
            Get shopping lists based on your meal plans and recipes
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
