// src/components/recipes/recipe-share-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Share } from "lucide-react";
import { api } from "~/trpc/react";

interface RecipeShareDialogProps {
  recipeId: string;
}

export function RecipeShareDialog({ recipeId }: RecipeShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"VIEW" | "EDIT">("VIEW");

  const shareRecipe = api.recipes.share.useMutation({
    onSuccess: () => {
      setOpen(false);
      setEmail("");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share className="mr-2 h-4 w-4" />
          Share Recipe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Recipe</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Share with</Label>
            <Input
              id="email"
              placeholder="Enter email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Permissions</Label>
            <Select
              value={permission}
              onValueChange={(value) => setPermission(value as "VIEW" | "EDIT")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEW">Can view</SelectItem>
                <SelectItem value="EDIT">Can edit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              shareRecipe.mutate({
                recipeId,
                shareWith: [email],
                permission,
              });
            }}
            disabled={!email || shareRecipe.isPending}
          >
            Share Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
