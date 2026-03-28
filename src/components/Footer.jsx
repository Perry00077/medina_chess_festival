import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { dictionary } = useLanguage();

  const footerLinks = [
    ["#festival", dictionary.festival],
    ["#tournois", dictionary.tournaments],
    ["#hebergement", dictionary.accommodation],
    ["#programme", dictionary.programme],
    ["#prix", dictionary.prizes],
    ["#galerie", dictionary.gallery],
    ["#contact", dictionary.contact],
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
            {footerLinks.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm text-[#cfc2ae] transition hover:text-[#d9bb64]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
