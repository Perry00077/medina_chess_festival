import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

function buildSectionLink(pathname, hash) {
  return pathname === "/" ? hash : `/${hash}`;
}

export default function Footer() {
  const { dictionary } = useLanguage();
  const location = useLocation();

  const footerLinks = [
    { type: "anchor", href: buildSectionLink(location.pathname, "#festival"), label: dictionary.festival },
    { type: "anchor", href: buildSectionLink(location.pathname, "#tournois"), label: dictionary.tournaments },
    { type: "anchor", href: buildSectionLink(location.pathname, "#hebergement"), label: dictionary.accommodation },
    { type: "anchor", href: buildSectionLink(location.pathname, "#programme"), label: dictionary.programme },
    { type: "anchor", href: buildSectionLink(location.pathname, "#prix"), label: dictionary.prizes },
    { type: "anchor", href: buildSectionLink(location.pathname, "#galerie"), label: dictionary.gallery },
    { type: "route", href: "/registration", label: dictionary.contact },
  ];

  return (
    <footer className="border-t border-[#c9a227]/15 bg-[#0d0d0d] text-[#f4ece1]">
      <div className="container py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 text-2xl text-[#d9bb64]">
                ♛
              </div>
              <div>
                <div className="font-display text-2xl font-black tracking-[0.1em]">
                  {dictionary.siteName}
                </div>
                <div className="text-xs uppercase tracking-[0.24em] text-[#c9a227]">
                  {dictionary.heroBadge}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {footerLinks.map((item) =>
              item.type === "route" ? (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm text-[#cfc2ae] transition hover:text-[#d9bb64]"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[#cfc2ae] transition hover:text-[#d9bb64]"
                >
                  {item.label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
