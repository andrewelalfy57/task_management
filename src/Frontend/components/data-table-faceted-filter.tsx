import * as React from "react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import dynamic from "next/dynamic";
const Check = dynamic(() => import("lucide-react").then((mod) => mod.Check));
const Filter = dynamic(() => import("lucide-react").then((mod) => mod.Filter));
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Column } from "@tanstack/react-table";

interface Option {
  value: string;
  label: string;
}

interface DataTableFacetedFilterProps {
  column: Column<any, any>;
  title: string;
  options: Option[];
}

export const DataTableFacetedFilter: React.FC<DataTableFacetedFilterProps> = ({
  column,
  title,
  options,
}) => {
  const facets = column?.getFacetedUniqueValues();
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(
    new Set((column?.getFilterValue() as string[]) || [])
  );

  const handleSelect = (value: string) => {
    const newSelectedValues = new Set(selectedValues);
    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value);
    } else {
      newSelectedValues.add(value);
    }
    setSelectedValues(newSelectedValues);

    const filterValues = Array.from(newSelectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  };

  const handleResetFilters = () => {
    setSelectedValues(new Set());
    column?.setFilterValue(undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ltr:ml-2 rtl:mr-2 h-8">
          <Filter className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by {title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value);
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected}
              onCheckedChange={() => handleSelect(option.value)}
            >
              {option.label}
              {facets?.get(option.value) && (
                <span className="ltr:ml-auto rtl:mr-auto text-xs text-muted-foreground">
                  ({facets.get(option.value)})
                </span>
              )}
            </DropdownMenuCheckboxItem>
          );
        })}
        {selectedValues.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem onCheckedChange={handleResetFilters}>
              Clear filters
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};