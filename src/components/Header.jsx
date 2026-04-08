import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";

function buildSectionLink(pathname, hash) {
  return pathname === "/" ? hash : `/${hash}`;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { dictionary } = useLanguage();
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { type: "anchor", href: buildSectionLink(location.pathname, "#festival"), label: dictionary.festival },
      { type: "anchor", href: buildSectionLink(location.pathname, "#tournois"), label: dictionary.tournaments },
      { type: "anchor", href: buildSectionLink(location.pathname, "#hebergement"), label: dictionary.accommodation },
      { type: "anchor", href: buildSectionLink(location.pathname, "#programme"), label: dictionary.programme },
      { type: "anchor", href: buildSectionLink(location.pathname, "#prix"), label: dictionary.prizes },
      { type: "anchor", href: buildSectionLink(location.pathname, "#galerie"), label: dictionary.gallery },
      { type: "route", href: "/registration", label: dictionary.contact },
    ],
    [dictionary, location.pathname],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b border-[#c9a227]/15 backdrop-blur-xl transition-all duration-300",
        scrolled
          ? "bg-[#0d0d0d]/95 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          : "bg-[#0d0d0d]/90",
      ].join(" ")}
    >
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-4 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 text-2xl text-[#d9bb64]">
            ♛
          </div>
          <div>
            <div className="font-display text-lg font-black tracking-[0.2em]">
              MEDINA
            </div>
            <div className="text-[10px] uppercase tracking-[0.34em] text-[#c9a227]">
              {dictionary.siteName}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navItems.map((item, index) => {
            const className = [
              "text-sm font-medium transition",
              index === navItems.length - 1
                ? "rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-[#f2d77e] hover:bg-[#c9a227] hover:text-[#111111]"
                : "text-[#efe6d8] hover:text-[#d9bb64]",
            ].join(" ");

            return item.type === "route" ? (
              <Link key={item.href} to={item.href} className={className}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className={className}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <LanguageSwitcher compact />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white xl:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#0d0d0d]/95 xl:hidden"
          >
            <div className="container space-y-3 py-4">
              {navItems.map((item) =>
                item.type === "route" ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#efe6d8]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#efe6d8]"
                  >
                    {item.label}
                  </a>
                ),
              )}
              <LanguageSwitcher />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
