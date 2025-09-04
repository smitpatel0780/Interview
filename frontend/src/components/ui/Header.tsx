"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
    return (
        <header className="sticky top-0 z-20 border-b shadow-sm bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto flex items-center justify-between p-4">

                {/* Logo */}
                <Link href="/" className="ml-4 text-xl font-bold text-primary">
                    🚀 Interview
                </Link>

                {/* User Profile */}
                <DropdownMenu>
                    <div className="flex items-center gap-2 cursor-mouse">
                        <span className="text-sm font-medium">User</span>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src="/avatar.png" alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/">Settings</Link>
                        </DropdownMenuItem>
                       <DropdownMenuItem>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
