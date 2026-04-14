"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CarIcon, MegaphoneIcon, MenuIcon, XIcon, LogOutIcon } from "lucide-react";

const navItems = [
  { href: "/admin/cars", label: "차량 관리", icon: CarIcon },
  { href: "/admin/notices", label: "공지 관리", icon: MegaphoneIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show admin layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-card md:block">
        <div className="flex h-14 items-center px-5">
          <span className="text-base font-semibold tracking-tight">관리자</span>
        </div>
        <Separator />
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 transform border-r bg-card transition-transform duration-200 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-5">
          <span className="text-base font-semibold tracking-tight">관리자</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon />
          </Button>
        </div>
        <Separator />
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon />
            </Button>
            <h1 className="text-sm font-medium text-muted-foreground">
              관리자 패널
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOutIcon className="size-4" />
            로그아웃
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
