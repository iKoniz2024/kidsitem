"use client";

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from "react";
import { Search, ShoppingCart, Sun, Moon, Menu, X, Phone, Package, House, Store, TrendingUp, Zap, Sparkles, LayoutGrid, ChevronDown, User, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useCart from "@/hooks/useCart";
import useTheme from "@/hooks/useTheme";
import { getCategoriesWithCounts } from "@/services/category.api";
import useSettings from "@/hooks/useSettings";
import { getLocalCartCount } from "@/utils/localCart";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
    const { cartCount, refetchCartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { siteName, logo, contactPhone } = useSettings();
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [search, setSearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCatOpen, setMobileCatOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data: categoriesData } = useQuery({
        queryKey: ["categories-with-counts"],
        queryFn: getCategoriesWithCounts,
        staleTime: 1000 * 60 * 1, // 1 minute cache
        gcTime: 1000 * 60 * 30,
    });

    const categoriesList = useMemo(() => {
        if (Array.isArray(categoriesData)) return categoriesData;
        if (Array.isArray(categoriesData?.categories)) return categoriesData.categories;
        return [];
    }, [categoriesData]);

    const mainCategoriesTree = useMemo(() => {
        if (!Array.isArray(categoriesList) || categoriesList.length === 0) return [];

        const topCats = categoriesList.filter((c) => {
            const pId = typeof c.parentId === "object" ? c.parentId?._id : c.parentId;
            return !pId;
        });

        return topCats.map((parent) => {
            const dbSubCats = categoriesList.filter((c) => {
                const pId = typeof c.parentId === "object" ? c.parentId?._id : c.parentId;
                return pId && String(pId) === String(parent._id);
            });

            const embeddedChildren = Array.isArray(parent.children) ? parent.children : [];
            const combinedSubCats = [...dbSubCats];

            embeddedChildren.forEach((emb) => {
                if (!combinedSubCats.some((c) => c.slug === emb.slug || String(c._id) === String(emb._id || emb.id))) {
                    combinedSubCats.push(emb);
                }
            });

            return {
                ...parent,
                subcategories: combinedSubCats,
            };
        });
    }, [categoriesList]);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const query = search.trim();
        if (query) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
        } else {
            router.push(`/products`);
        }
        setMobileOpen(false);
    };

    useEffect(() => {
        refetchCartCount(getLocalCartCount());
        setMounted(true);
    }, [refetchCartCount]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlSearch = new URLSearchParams(window.location.search).get("search") || "";
            setSearch(urlSearch);
        }
    }, [pathname]);

    return (
        <header className="sticky top-0 z-100 bg-white text-slate-800 border-b border-slate-100 shadow-xs dark:bg-slate-900 dark:text-white dark:border-slate-800">
            {/* Top Header (Clean White & Soft Ice Blue) */}
            <div className="bg-white dark:bg-slate-900">
                <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0">
                        {logo ? (
                            <img src={logo} alt={siteName || "Logo"} className="h-9 sm:h-12 w-auto object-contain" />
                        ) : siteName ? (
                            <span suppressHydrationWarning className="text-xl sm:text-2xl font-black text-[#FF6584] tracking-tight">
                                {siteName}
                            </span>
                        ) : null}
                    </Link>

                    {/* Eye-Friendly Search Bar (Candy Pink Button) */}
                    <div className="hidden flex-1 max-w-2xl md:block">
                        <form onSubmit={handleSearchSubmit} className="flex items-center w-full rounded-full border border-pink-200/80 bg-pink-50/30 p-1 focus-within:border-[#FF6584] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF6584]/20 transition-all shadow-2xs dark:bg-slate-800 dark:border-slate-700">
                            <input
                                type="text"
                                placeholder="Search products, toys, clothing..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-6 bg-transparent pl-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none dark:text-white"
                            />
                            <button
                                type="submit"
                                className="flex h-8 px-6 shrink-0 items-center gap-1.5 justify-center rounded-full bg-[#FF6584] hover:bg-[#EE4D6D] text-white text-xs font-bold shadow-xs transition-all hover:scale-105 cursor-pointer"
                                title="Search"
                            >
                                <Search className="size-3.5 text-white" />
                                <span>Search</span>
                            </button>
                        </form>
                    </div>

                    {/* Right Utilities */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/orders"
                            className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 md:flex shrink-0 shadow-2xs group dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <Package className="size-4 shrink-0 text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-white" />
                            <span>Track Order</span>
                        </Link>

                        {mounted && contactPhone && (
                            <a
                                href={`tel:${contactPhone}`}
                                className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-[#FF6584] hover:text-[#FF6584] md:flex shrink-0 shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                            >
                                <Phone className="size-3.5 shrink-0 text-[#FF6584]" />
                                <span>{contactPhone}</span>
                            </a>
                        )}

                        <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 md:block" />

                        <button
                            onClick={toggleTheme}
                            className="hidden sm:flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:scale-105 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                            title={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {mounted && theme === "dark" ? <Sun className="size-4 text-[#FFC107]" /> : <Moon className="size-4 text-[#FF6584]" />}
                        </button>

                        {(!user || (user.role !== "admin" && user.role !== "vendor")) && (
                            <Link
                                href="/cart"
                                className="relative flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:scale-105 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                            >
                                <ShoppingCart className="size-4.5 text-slate-700 dark:text-slate-300" />
                                {mounted && cartCount > 0 && (
                                    <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#FF6584] text-[10px] font-black text-white shadow-md">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {mounted && (
                            user ? (
                                <div ref={profileRef} className="relative group/profile">
                                    <button
                                        onClick={() => setProfileOpen((prev) => !prev)}
                                        className="flex size-9 items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-sm font-black text-primary-foreground shadow-md ring-2 ring-primary/30 transition-all duration-200 hover:scale-105 cursor-pointer"
                                        title="Account Menu"
                                    >
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </button>
                                    <div
                                        className={`transition-all duration-200 absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-2xl text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-white ${profileOpen
                                            ? "visible opacity-100 scale-100"
                                            : "invisible opacity-0 scale-95 group-hover/profile:visible group-hover/profile:opacity-100 group-hover/profile:scale-100"
                                            }`}
                                    >
                                        <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            href={user?.role === "vendor" ? "/dashboard/vendor" : "/dashboard"}
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-primary transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            <LayoutDashboard className="size-4 text-primary" />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-primary transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            <User className="size-4 text-primary" />
                                            <span>Profile</span>
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                setProfileOpen(false);
                                                await logout();
                                                router.push("/");
                                            }}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer mt-1 dark:hover:bg-rose-950/40"
                                        >
                                            <LogOut className="size-4 text-rose-500" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex rounded-full bg-primary hover:bg-primary/90 px-4.5 py-2 text-xs font-bold text-primary-foreground transition-all duration-200 hover:scale-105 shadow-xs"
                                >
                                    Login
                                </Link>
                            )
                        )}

                        <button
                            onClick={() => setMobileOpen(true)}
                            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 md:hidden dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                        >
                            <Menu className="size-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Second Navigation Bar (Vibrant Darker Sky Blue) */}
            <nav className="hidden border-t border-sky-300 md:block bg-[#BAE6FD] dark:bg-slate-900/90 dark:border-slate-800">
                <div className="relative mx-auto max-w-7xl px-4">
                    <div className="flex h-12 sm:h-13 items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Link href="/" className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${pathname === "/" ? "bg-white text-[#FF6584] border border-pink-200/80 shadow-2xs" : "text-slate-700 hover:bg-white hover:text-[#FF6584] dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                                <House className="size-4 text-[#FF6584]" />
                                <span>Home</span>
                            </Link>

                            {/* Categories Mega Dropdown */}
                            <div className="group/cat">
                                <button className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-[#FF6584] transition-all cursor-pointer dark:text-slate-300 dark:hover:bg-slate-800">
                                    <LayoutGrid className="size-4 text-[#FF6584]" />
                                    <span>Categories</span>
                                    <ChevronDown className="size-3.5 text-slate-400 group-hover/cat:rotate-180 transition-transform duration-200" />
                                </button>

                                {/* Mega Dropdown Menu */}
                                <div className="invisible opacity-0 group-hover/cat:visible group-hover/cat:opacity-100 transition-all duration-200 absolute left-4 right-4 top-full z-100 mt-1 rounded-2xl border border-pink-100 bg-white p-6 shadow-2xl text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-white">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-h-[420px] overflow-y-auto pr-1">
                                        {mainCategoriesTree && mainCategoriesTree.length > 0 ? (
                                            mainCategoriesTree.map((cat, idx) => (
                                                <div key={cat._id || `${cat.slug || 'cat'}-${idx}`} className="space-y-2">
                                                    <Link
                                                        href={`/products?category=${cat.slug}`}
                                                        className="block text-sm sm:text-base font-extrabold text-[#FF6584] hover:text-[#EE4D6D] transition-colors truncate dark:text-[#FF6584]"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                    {cat.subcategories && cat.subcategories.length > 0 && (
                                                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 font-medium dark:text-slate-300">
                                                            {cat.subcategories.map((child, cIdx) => (
                                                                <li key={child._id || `${child.slug || 'child'}-${cIdx}`}>
                                                                    <Link
                                                                        href={`/products?category=${child.slug}`}
                                                                        className="hover:text-[#FF6584] hover:underline block truncate transition-colors pl-1"
                                                                    >
                                                                        • {child.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-slate-400 col-span-full">Loading categories...</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Link href="/products" className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${pathname === "/products" ? "bg-white text-[#FF6584] border border-pink-200/80 shadow-2xs" : "text-slate-700 hover:bg-white hover:text-[#FF6584] dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                                <Store className="size-4 text-[#FF6584]" />
                                <span>Shop Products</span>
                            </Link>

                            <Link
                                href="/best-selling"
                                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${pathname === "/best-selling" ? "bg-white text-[#FF6584] border border-pink-200/80 shadow-2xs" : "text-slate-700 hover:bg-white hover:text-[#FF6584] dark:text-slate-300 dark:hover:bg-slate-800"}`}
                            >
                                <TrendingUp className="size-4 text-[#FF6584]" />
                                <span>Best Selling</span>
                            </Link>

                            <Link
                                href="/flash-sale"
                                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${pathname === "/flash-sale" ? "bg-white text-[#FF6584] border border-pink-200/80 shadow-2xs" : "text-slate-700 hover:bg-white hover:text-[#FF6584] dark:text-slate-300 dark:hover:bg-slate-800"}`}
                            >
                                <Zap className="size-4 text-[#FF6584] fill-[#FF6584]/20" />
                                <span>Flash Deals</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/become-seller"
                                className="flex items-center gap-1.5 rounded-full bg-[#FF6584] hover:bg-[#EE4D6D] text-white px-4 py-1.5 text-xs font-bold transition-all hover:scale-105 shadow-2xs"
                            >
                                <Sparkles className="size-3.5 text-white" />
                                <span>Become a Seller</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-100 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white text-slate-800 shadow-2xl overflow-y-auto border-r border-slate-200 dark:bg-slate-900 dark:text-white dark:border-slate-800 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 px-5 py-4">
                                <Link href="/" onClick={() => setMobileOpen(false)}>
                                    {logo ? (
                                        <img src={logo} alt={siteName || "Logo"} className="h-9 w-auto object-contain" />
                                    ) : siteName ? (
                                        <span suppressHydrationWarning className="text-lg font-black text-[#FF6584]">{siteName}</span>
                                    ) : null}
                                </Link>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <div className="px-5 py-4">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-full border border-pink-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#FF6584] shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                </form>
                            </div>

                            <nav className="border-t border-slate-200/80 dark:border-slate-800 px-5 py-3 space-y-1">
                                <Link
                                    href="/"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-pink-50 hover:text-[#FF6584] transition-all dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <House className="size-4 text-[#FF6584]" /> Home
                                </Link>

                                <Link
                                    href="/products"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-pink-50 hover:text-[#FF6584] transition-all dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <Store className="size-4 text-[#FF6584]" /> Shop Products
                                </Link>

                                <Link
                                    href="/best-selling"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-pink-50 hover:text-[#FF6584] transition-all dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <TrendingUp className="size-4 text-[#FF6584]" /> Best Selling
                                </Link>

                                <Link
                                    href="/flash-sale"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-pink-50 hover:text-[#FF6584] transition-all dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <Zap className="size-4 text-[#FF6584] fill-[#FF6584]/20" /> Flash Deals
                                </Link>

                                <Link
                                    href="/orders"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-pink-50 hover:text-[#FF6584] transition-all dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <Package className="size-4 text-[#FF6584]" /> Track Order
                                </Link>

                                <Link
                                    href="/become-seller"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-pink-50 hover:text-[#FF6584] transition-all dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <Sparkles className="size-4 text-[#FF6584]" /> Become a Seller
                                </Link>
                            </nav>
                        </div>

                        {/* Mobile Drawer Profile / Account Footer */}
                        {mounted && (
                            user ? (
                                <div className="border-t border-slate-200/80 dark:border-slate-800 px-5 py-4 mt-auto space-y-3 bg-white/60 dark:bg-slate-800/60">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-full bg-[#FF6584] text-base font-black text-white shadow-md shrink-0">
                                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                        <div className="truncate flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <Link
                                            href={user?.role === "vendor" ? "/dashboard/vendor" : "/dashboard"}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-200 transition-all"
                                        >
                                            <LayoutDashboard className="size-3.5 text-[#FF6584]" />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-200 transition-all"
                                        >
                                            <User className="size-3.5 text-[#FF6584]" />
                                            <span>Profile</span>
                                        </Link>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            setMobileOpen(false);
                                            await logout();
                                            router.push("/");
                                        }}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50 px-3 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition-all cursor-pointer"
                                    >
                                        <LogOut className="size-3.5 text-rose-500" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-slate-200/80 dark:border-slate-800 px-5 py-4 mt-auto">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6584] hover:bg-[#EE4D6D] py-2.5 text-xs font-black text-white shadow-md"
                                    >
                                        <LogIn className="size-4" />
                                        <span>Login / Register</span>
                                    </Link>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
