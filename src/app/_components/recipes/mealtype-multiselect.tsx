import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { MealType } from "@prisma/client";

interface MultiSelectProps {
  options: MealType[];
  selected: MealType[];
  onChange: (values: MealType[]) => void;
}

export function MealTypeSelect({
  options,
  selected,
  onChange,
}: MultiSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-h-10 w-full justify-start">
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((option) => (
                <Badge
                  key={option}
                  variant="secondary"
                  className="mb-1 mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selected.filter((s) => s !== option));
                  }}
                >
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          ) : (
            "Select meal types"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <Button
              key={option}
              variant={selected.includes(option) ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                if (selected.includes(option)) {
                  onChange(selected.filter((s) => s !== option));
                } else {
                  onChange([...selected, option]);
                }
              }}
            >
              {option.charAt(0) + option.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
