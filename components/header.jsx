import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { FolderOpen, PenBox } from "lucide-react";
import UserMenu from "./ui/user-menu";

const Header = () => {
  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href={"/"}>
          <Image
            src={"/my-notion-face-transparent.png"}
            alt="Journal logo"
            width={200}
            height={60}
            className="h-15 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard#collections">
              <Button variant="outline">
                {" "}
                <FolderOpen size={18} />
                <span className="hidden md:inline">Collections</span>
              </Button>
            </Link>
          </SignedIn>

          <Link href="/journal/write">
            <Button variant="journal">
              {" "}
              <PenBox size={18} />
              <span className="hidden md:inline">Write New</span>
            </Button>
          </Link>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserMenu/>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
