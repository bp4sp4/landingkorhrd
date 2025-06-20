"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/admin/dashboard/actions";

export default function AdminHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          사이트 메인으로
        </Link>
        <form action={logout}>
          <Button type="submit" variant="outline">
            로그아웃
          </Button>
        </form>
      </nav>
    </header>
  );
}
