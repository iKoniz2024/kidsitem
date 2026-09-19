"use client";

import Link from 'next/link';

import { Phone, MapPin, Mail } from "lucide-react";
import useSettings from "@/hooks/useSettings";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "All Products", to: "/products" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const SERVICES_LINKS = [
  { label: "Refund and Returns Policy", to: "/return-policy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Delivery Rules", to: "/delivery-rules" },
];

export default function Footer() {
  const {
    siteName,
    logo,
    contactEmail,
    contactPhone,
    address,
    facebookUrl,
    instagramUrl,
    tiktokUrl,
    youtubeUrl,
  } = useSettings();

  const formatExternalUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const socialLinks = [
    { icon: FaFacebookF, href: formatExternalUrl(facebookUrl), label: "Facebook" },
    { icon: FaInstagram, href: formatExternalUrl(instagramUrl), label: "Instagram" },
    { icon: FaTiktok, href: formatExternalUrl(tiktokUrl), label: "TikTok" },
    { icon: FaYoutube, href: formatExternalUrl(youtubeUrl), label: "YouTube" },
  ];

  return (
    <footer className="border-t border-sky-300 bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] text-slate-800 dark:bg-slate-900 dark:text-white dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4">
            {logo && (
              <Link href="/" className="inline-block">
                <img src={logo} alt={siteName} className="h-20 sm:h-28 w-auto object-contain" />
              </Link>
            )}
            <p suppressHydrationWarning className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
              {siteName} — your trusted destination for quality kids products, toys, clothing & everyday essentials, delivered conveniently across Bangladesh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#FF6584] dark:text-pink-400">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.to}
                    className="text-sm text-slate-700 font-medium transition-colors duration-200 hover:text-[#FF6584] dark:text-slate-300 dark:hover:text-[#FF6584]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Help */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#FF6584] dark:text-pink-400">
              Services & Help
            </h3>
            <ul className="space-y-2.5">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.to}
                    className="text-sm text-slate-700 font-medium transition-colors duration-200 hover:text-[#FF6584] dark:text-slate-300 dark:hover:text-[#FF6584]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons & Contact Info Column */}
          <div className="space-y-4 pt-1">
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const href = social.href || "#";
                return (
                  <a
                    key={social.label}
                    href={href}
                    target={social.href ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-full border border-pink-200 bg-white text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF6584] hover:bg-[#FF6584] hover:text-white shadow-2xs"
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
            <div className="space-y-2.5 text-sm text-slate-700 font-medium dark:text-slate-300">
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 transition-colors hover:text-[#FF6584]">
                  <Mail className="size-4 shrink-0 text-[#FF6584]" />
                  {contactEmail}
                </a>
              )}
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="flex items-center gap-2 transition-colors hover:text-[#FF6584]">
                  <Phone className="size-4 shrink-0 text-[#FF6584]" />
                  {contactPhone}
                </a>
              )}
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#FF6584]" />
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="border-t border-sky-300 bg-[#7DD3FC] dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p suppressHydrationWarning className="text-xs font-semibold text-slate-800 dark:text-slate-300">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-slate-800 dark:text-slate-300">
            <Link href="/terms" className="hover:text-[#FF6584]">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#FF6584]">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
