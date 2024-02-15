import React from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import AIChatButton from "@/components/AIChatButton";

const Navbar = () => {
  return (
    <header className="sticky top-0 bg-background">
      <div className="mx-auto flex max-w-3xl flex-wrap justify-between gap-3 px-3 py-4">
        <nav className="space-x-4 font-medium">
          <Link href="/">home</Link>
          <Link href="/about">about me</Link>
          <Link href="/social">social</Link>
        </nav>
        <div className="flex items-center gap-4">
          <AIChatButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
