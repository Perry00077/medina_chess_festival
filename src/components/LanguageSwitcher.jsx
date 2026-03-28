import { useEffect, useRef, useState } from "react";
import { Globe2, ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const fullNames = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  ru: "Русский",
  ar: "العربية",
};

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, languages, dictionary } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setOpen(false);
  };

  const widthClass = compact ? "w-[175px]" : "w-full max-w-[240px]";

  return (
    <div
      ref={wrapperRef}
      className={`relative ${widthClass}`}
      aria-label={dictionary.language}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex w-full items-center justify-between rounded-full border border-white/10 bg-[#141414]/95 p-1 text-white shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-[#c9a227]/35"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 pl-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#d8cec0]">
          <Globe2 className="h-4 w-4 text-[#d8cec0]" />
          <span>Lang</span>
        </span>

        <span className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300">
          {languages[language]?.label || language.toUpperCase()}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-[calc(100%+10px)] z-[80] overflow-hidden rounded-[30px] border border-white/10 bg-[#141414]/98 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <div className="max-h-64 overflow-y-auto pr-1">
              {Object.entries(languages).map(([code, meta]) => {
                const active = language === code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelect(code)}
                    className={`mb-1 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-200 last:mb-0 ${
                      active
                        ? "bg-[#c9a227] text-[#111111]"
                        : "bg-transparent text-[#efe6d8] hover:bg-white/5"
                    }`}
                    role="option"
                    aria-selected={active}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`min-w-[34px] text-sm font-bold uppercase tracking-[0.18em] ${
                          active ? "text-[#111111]" : "text-[#d8cec0]"
                        }`}
                      >
                        {meta.label}
                      </span>
                      <span
                        className={`text-sm ${
                          active ? "text-[#111111]" : "text-[#cfc6ba]"
                        }`}
                      >
                        {fullNames[code]}
                      </span>
                    </span>

                    {active ? <Check className="h-4 w-4" /> : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
