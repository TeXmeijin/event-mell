"use client";

import Profile from "@/components/profile";
import { Button } from "@/components/ui/button";
import useWindow from "@/hooks/use-window";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const { isDesktop } = useWindow();
  const path = usePathname();
  const { isSignedIn, user } = useUser();
  return (
    <header className="w-screen bg-gray_background px-4">
      <nav className="md:py-8 py-4 flex w-full justify-between items-center z-50">
        <h2 className="text-2xl font-thin flex flex-col items-center">
          <span className={"text-xs"}>イベント案を試すなら</span>
          <Link href={"/"}>EventMell</Link>
        </h2>
        <div className="flex justify-center items-center gap-2">
          {isSignedIn ? (
            path === "/dashboard" ? (
              <Profile user={user} />
            ) : (
              <Button className="flex" variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )
          ) : (
            <Button className="flex" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
