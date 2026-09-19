"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useSettings from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Image as ImageIcon,
  ShoppingCart,
  Settings,
  User,
  Home,
  Store,
  ShieldCheck,
  Package
} from "lucide-react";

export default function Sidebar({ open, onClose }) {
  const { siteName, logo } = useSettings();
  const { user } = useAuth();
  const pathname = usePathname();

  const isVendor = user?.role === "vendor";

  const vendorMenuItems = [
    {
      name: "Store Dashboard",
      path: "/dashboard/vendor",
      icon: LayoutDashboard,
    },
    {
      name: "My Products",
      path: "/dashboard/products",
      icon: ShoppingBag,
    },
    {
      name: "Shop Profile",
      path: "/dashboard/profile",
      icon: User,
    },
    {
      name: "View Store Front",
      path: "/",
      icon: Home,
    },
  ];

  const adminMenuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/dashboard/products",
      icon: ShoppingBag,
    },
    {
      name: "Categories",
      path: "/dashboard/categories",
      icon: Tags,
    },
    {
      name: "Banners",
      path: "/dashboard/banners",
      icon: ImageIcon,
    },
    {
      name: "Customer Orders",
      path: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      name: "Sellers & Vendors",
      path: "/dashboard/vendors",
      icon: Store,
    },
    {
      name: "Site Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: User,
    },
    {
      name: "View Store Front",
      path: "/",
      icon: Home,
    },
  ];

  const menuItems = isVendor ? vendorMenuItems : adminMenuItems;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card p-4 transition-transform duration-200 lg:static lg:translate-x-0 flex flex-col justify-between ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div>
          {/* Logo Header */}
          <div className="px-2 py-3 mb-2 flex items-center justify-between border-b border-border/60">
            <Link href="/" className="flex items-center">
              {logo ? (
                <img src={logo} alt={siteName} className="h-9 w-auto object-contain dark:invert" />
              ) : (
                <span suppressHydrationWarning className="text-lg font-black text-foreground">{siteName || "KidsItem"}</span>
              )}
            </Link>
          </div>

          {/* Role Header Badge */}
          {isVendor ? (
            <div className="mb-4 rounded-xl bg-[#BAE6FD]/50 border border-[#7DD3FC] p-2.5 flex items-center gap-2.5 text-[#0284C7] dark:bg-sky-950/40 dark:border-sky-900/40">
              <Store className="size-4 shrink-0 text-[#0284C7]" />
              <div className="truncate">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#0284C7]">Vendor Portal</p>
                <p className="text-xs font-bold text-foreground truncate">{user?.vendorInfo?.shopName || user?.name}</p>
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-xl bg-[#BAE6FD]/50 border border-[#7DD3FC] p-2.5 flex items-center gap-2.5 text-[#0284C7] dark:bg-sky-950/40 dark:border-sky-900/40">
              <ShieldCheck className="size-4 shrink-0 text-[#0284C7]" />
              <div className="truncate">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#0284C7]">Admin Panel</p>
                <p className="text-xs font-bold text-foreground truncate">{user?.name || "Administrator"}</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.path === "/dashboard" || item.path === "/dashboard/vendor"
                  ? pathname === item.path
                  : pathname.startsWith(item.path);

              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition-all ${
                    isActive
                      ? "bg-[#38BDF8] text-white shadow-md shadow-[#38BDF8]/25"
                      : "text-slate-600 dark:text-slate-400 hover:bg-[#E0F2FE] hover:text-[#0284C7] dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`size-4.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-border/60 px-2 text-[11px] text-muted-foreground text-center">
          <p>© {new Date().getFullYear()} {siteName}</p>
        </div>
      </aside>
    </>
  );
}
