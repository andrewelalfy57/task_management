"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";
import { useTheme } from "next-themes"; // Import theme hook

const X = dynamic(() => import("lucide-react").then((mod) => mod.X));
const Sun = dynamic(() => import("lucide-react").then((mod) => mod.Sun));
const Moon = dynamic(() => import("lucide-react").then((mod) => mod.Moon));

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { statuses } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { CreateTaskDialog } from "./data-table-add-task";
import Image from "next/image";
import logo from "../../assets/companyLogo.png";

interface DataTableToolbarProps {
  table: Table<any>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const statusColumn = table.getColumn("status");

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration issues

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      <Input
        placeholder="Search tasks's title ..."
        value={(table.getColumn("title")?.getFilterValue() as string) || ""}
        onChange={(event) =>
          table.getColumn("title")?.setFilterValue(event.target.value)
        }
        className="h-12 min-w-[240px] max-w-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-center"
      />

      <div className="flex flex-1 justify-center">
        <Image src={logo} alt="Project Logo" className="h-16 w-auto" />
      </div>

      <div className="flex items-center gap-3">
        {statusColumn && (
          <DataTableFacetedFilter
            column={statusColumn}
            title="Status"
            options={statuses}
          />
        )}

        {/* Reset Button */}
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-3 flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Reset Filters
            <X className="h-4 w-4" />
          </Button>
        )}

       

        <DataTableViewOptions table={table} />
        <CreateTaskDialog />
         {/* Dark Mode Toggle Button */}
         <Button
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-10 px-3 flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
    </div>
  );
}
