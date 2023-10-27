"use client";

import { UserButton } from "@clerk/nextjs";
import { MainNav } from "~/components/main-nav";
import { ModeToggle } from "~/components/ui/theme-toggle";

import OrgSwitcher from "./org-switcher";

export default function DashboardNav() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-background px-4">
      <OrgSwitcher />
      <MainNav />
      <div className=" ml-4 flex w-[200px] items-center justify-end space-x-4">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
}
