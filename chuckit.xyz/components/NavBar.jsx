import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function NavBar() {
  return (
    <header className="sticky top-0 flex h-16 items-center w-full justify-between gap-4 border-b px-4 md:px-6 bg-background">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold md:text-xl text-blue-400"
      >
        <span className="">chuckit.xyz</span>
      </Link>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/about"
          className="text-foreground transition-colors hover:text-blue-400 text-base"
        >
          About
        </Link>
        <Link
          href="/roadmap"
          className="text-foreground transition-colors hover:text-blue-400 text-base"
        >
          Roadmap
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden bg-blue-950"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/about"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/roadmap"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Roadmap
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
