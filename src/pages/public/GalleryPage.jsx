import { motion } from "framer-motion";
import { ArrowLeft, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import hannibalImage from "../../assets/salle-hannibal.jpg";
import medinaImage from "../../assets/medina.jpg";
import beachImage from "../../assets/hammamet-yasmine-beach-image.jpg";
import soukImage from "../../assets/souk.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const galleryTitles = {
  fr: [
    "Salle de jeu Hannibal",
    "La Medina",
    "La plage de Yasmine",
    "Les souks",
  ],
  en: [
    "Hannibal playing hall",
    "The Medina",
    "Yasmine beach",
    "The souks",
  ],
  de: [
    "Hannibal-Spielsaal",
    "Die Medina",
    "Der Strand von Yasmine",
    "Die Souks",
  ],
  ru: [
    "Игровой зал Hannibal",
    "Медина",
    "Пляж Ясмин",
    "Суки",
  ],
  ar: [
    "قاعة اللعب حنبعل",
    "المدينة",
    "شاطئ ياسمين",
    "الأسواق التقليدية",
  ],
};

export default function GalleryPage() {
  const { language, dictionary } = useLanguage();
  const titles = galleryTitles[language] || galleryTitles.fr;
  const images = [
    { image: hannibalImage, title: titles[0] },
    { image: medinaImage, title: titles[1] },
    { image: beachImage, title: titles[2] },
    { image: soukImage, title: titles[3] },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#f4ece1]">
      <section className="relative overflow-hidden border-b border-[#c9a227]/15 bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.18),transparent_32%),#111111]">
        <div className="container py-12 sm:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-5 py-3 text-sm font-semibold text-[#f2d77e] transition hover:bg-[#c9a227] hover:text-[#111111]"
          >
            <ArrowLeft className="h-4 w-4" />
            {dictionary.backToHome || "Retour à l’accueil"}
          </Link>

          <div className="mt-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f0d37b]">
              <Camera className="h-4 w-4" />
              {dictionary.gallery || "Galerie"}
            </div>
            <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
              {dictionary.galleryPageTitle || "Galerie complète"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#ddd2c0] sm:text-base">
              {dictionary.galleryPageDescription || "Retrouvez l’ensemble des photos disponibles du site et de la salle de jeu."}
            </p>
          </div>
        </div>
      </section>

      <main className="container py-10 sm:py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {images.map((item, index) => (
            <motion.figure
              key={item.title}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: index * 0.08 }}
              className="overflow-hidden rounded-[32px] border border-white/10 bg-[#171717] shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
              <figcaption className="border-t border-white/10 px-6 py-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[#c9a227]">
                  {dictionary.gallery || "Galerie"}
                </p>
                <p className="mt-2 font-display text-2xl text-white">
                  {item.title}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </main>
    </div>
  );
}
