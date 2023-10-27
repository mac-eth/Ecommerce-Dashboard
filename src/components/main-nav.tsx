"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

interface MainNavProps {
  className?: string;
}

const navigation = [
  { name: "Overview", href: "/dashboard" },
  { name: "Profitability", href: "/dashboard/profitability" },
  { name: "Reports", href: "/dashboard/reports" },
  { name: "Settings", href: "/dashboard/settings" },
];

export function MainNav({ className, ...props }: MainNavProps) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "hidden items-center space-x-4 sm:flex lg:space-x-6",
        className
      )}
      {...props}
    >
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={{
            pathname: item.href,
          }}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            pathname === item.href ? "text-default" : "text-muted-foreground"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
