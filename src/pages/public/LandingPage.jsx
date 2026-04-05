import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Camera,
  CheckCircle2,
  Crown,
  Download,
  MapPin,
  Medal,
  ScrollText,
  Shield,
  Sparkles,
  Star,
  TimerReset,
  Trophy,
  Waves,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RegistrationForm from "../../components/RegistrationForm";
import { useLanguage } from "../../contexts/LanguageContext";
import medinaImage from "../../assets/medina.jpg";
import beachImage from "../../assets/hammamet-yasmine-beach-image.jpg";
import hannibalImage from "../../assets/salle-hannibal.jpg";
import soukImage from "../../assets/souk.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const prizeContentMap = {
  fr: {
    generalTitle: "🏆 Classement général",
    generalHeaders: ["Place", "Magistral", "Challenge", "Blitz", "Total"],
    generalRows: [
      ["1°", "3 000 €", "500 €", "300 €", "3 800 €"],
      ["2°", "1 500 €", "300 €", "200 €", "2 000 €"],
      ["3°", "1 000 €", "200 €", "150 €", "1 350 €"],
      ["4°", "700 €", "150 €", "100 €", "950 €"],
      ["5°", "500 €", "120 €", "50 €", "670 €"],
      ["6°", "400 €", "100 €", "—", "500 €"],
      ["7°", "300 €", "100 €", "—", "400 €"],
      ["8°", "200 €", "100 €", "—", "300 €"],
      ["9°", "150 €", "100 €", "—", "250 €"],
      ["10°", "100 €", "100 €", "—", "200 €"],
    ],
    specialTitle: "♟ Catégories spéciales",
    specialHeaders: [
      "Catégorie",
      "Place",
      "Magistral",
      "Challenge",
      "Blitz",
      "Total",
    ],
    specialRows: [
      ["Féminine", "1°", "700 €", "300 €", "—", "1 000 €"],
      ["Féminine", "2°", "600 €", "200 €", "—", "800 €"],
      ["Féminine", "3°", "500 €", "100 €", "—", "600 €"],
      ["Senior + 50 ans", "1°", "150 €", "100 €", "100 €", "350 €"],
      ["Vétéran + 65", "1°", "150 €", "100 €", "100 €", "350 €"],
      ["U18", "1°", "100 €", "100 €", "—", "200 €"],
      ["U16", "1°", "100 €", "100 €", "—", "200 €"],
      ["U14", "1°", "100 €", "100 €", "—", "200 €"],
      ["Spéciaux tunisiens", "1°", "200 €", "150 €", "100 €", "450 €"],
      ["Spéciaux tunisiens", "2°", "150 €", "100 €", "—", "250 €"],
      ["Spéciaux tunisiens", "3°", "100 €", "100 €", "—", "200 €"],
    ],
    grandTotalLabel: "TOTAL PRIX",
    grandTotal: "15 020 €",
    sponsorNote:
      "Les prix spéciaux tunisiens en numéraire et en nature seront communiqués ultérieurement par les sponsors.",
  },
  en: {
    generalTitle: "🏆 Overall ranking",
    generalHeaders: ["Place", "Magistral", "Challenge", "Blitz", "Total"],
    generalRows: [
      ["1st", "€3,000", "€500", "€300", "€3,800"],
      ["2nd", "€1,500", "€300", "€200", "€2,000"],
      ["3rd", "€1,000", "€200", "€150", "€1,350"],
      ["4th", "€700", "€150", "€100", "€950"],
      ["5th", "€500", "€120", "€50", "€670"],
      ["6th", "€400", "€100", "—", "€500"],
      ["7th", "€300", "€100", "—", "€400"],
      ["8th", "€200", "€100", "—", "€300"],
      ["9th", "€150", "€100", "—", "€250"],
      ["10th", "€100", "€100", "—", "€200"],
    ],
    specialTitle: "♟ Special categories",
    specialHeaders: [
      "Category",
      "Place",
      "Magistral",
      "Challenge",
      "Blitz",
      "Total",
    ],
    specialRows: [
      ["Women", "1st", "€700", "€300", "—", "€1,000"],
      ["Women", "2nd", "€600", "€200", "—", "€800"],
      ["Women", "3rd", "€500", "€100", "—", "€600"],
      ["Senior +50", "1st", "€150", "€100", "€100", "€350"],
      ["Veteran +65", "1st", "€150", "€100", "€100", "€350"],
      ["U18", "1st", "€100", "€100", "—", "€200"],
      ["U16", "1st", "€100", "€100", "—", "€200"],
      ["U14", "1st", "€100", "€100", "—", "€200"],
      ["Tunisian special prizes", "1st", "€200", "€150", "€100", "€450"],
      ["Tunisian special prizes", "2nd", "€150", "€100", "—", "€250"],
      ["Tunisian special prizes", "3rd", "€100", "€100", "—", "€200"],
    ],
    grandTotalLabel: "TOTAL PRIZES",
    grandTotal: "€15,020",
    sponsorNote:
      "Special Tunisian cash and in-kind prizes will be announced later by the sponsors.",
  },
  de: {
    generalTitle: "🏆 Gesamtwertung",
    generalHeaders: ["Platz", "Magistral", "Challenge", "Blitz", "Total"],
    generalRows: [
      ["1.", "3 000 €", "500 €", "300 €", "3 800 €"],
      ["2.", "1 500 €", "300 €", "200 €", "2 000 €"],
      ["3.", "1 000 €", "200 €", "150 €", "1 350 €"],
      ["4.", "700 €", "150 €", "100 €", "950 €"],
      ["5.", "500 €", "120 €", "50 €", "670 €"],
      ["6.", "400 €", "100 €", "—", "500 €"],
      ["7.", "300 €", "100 €", "—", "400 €"],
      ["8.", "200 €", "100 €", "—", "300 €"],
      ["9.", "150 €", "100 €", "—", "250 €"],
      ["10.", "100 €", "100 €", "—", "200 €"],
    ],
    specialTitle: "♟ Sonderkategorien",
    specialHeaders: [
      "Kategorie",
      "Platz",
      "Magistral",
      "Challenge",
      "Blitz",
      "Total",
    ],
    specialRows: [
      ["Damen", "1.", "700 €", "300 €", "—", "1 000 €"],
      ["Damen", "2.", "600 €", "200 €", "—", "800 €"],
      ["Damen", "3.", "500 €", "100 €", "—", "600 €"],
      ["Senior +50", "1.", "150 €", "100 €", "100 €", "350 €"],
      ["Veteran +65", "1.", "150 €", "100 €", "100 €", "350 €"],
      ["U18", "1.", "100 €", "100 €", "—", "200 €"],
      ["U16", "1.", "100 €", "100 €", "—", "200 €"],
      ["U14", "1.", "100 €", "100 €", "—", "200 €"],
      ["Tunesische Sonderpreise", "1.", "200 €", "150 €", "100 €", "450 €"],
      ["Tunesische Sonderpreise", "2.", "150 €", "100 €", "—", "250 €"],
      ["Tunesische Sonderpreise", "3.", "100 €", "100 €", "—", "200 €"],
    ],
    grandTotalLabel: "GESAMTPREISFONDS",
    grandTotal: "15 020 €",
    sponsorNote:
      "Tunesische Sonderpreise in Geld- und Sachwerten werden später von den Sponsoren bekanntgegeben.",
  },
  ru: {
    generalTitle: "🏆 Общий зачет",
    generalHeaders: ["Место", "Magistral", "Challenge", "Blitz", "Итого"],
    generalRows: [
      ["1", "3 000 €", "500 €", "300 €", "3 800 €"],
      ["2", "1 500 €", "300 €", "200 €", "2 000 €"],
      ["3", "1 000 €", "200 €", "150 €", "1 350 €"],
      ["4", "700 €", "150 €", "100 €", "950 €"],
      ["5", "500 €", "120 €", "50 €", "670 €"],
      ["6", "400 €", "100 €", "—", "500 €"],
      ["7", "300 €", "100 €", "—", "400 €"],
      ["8", "200 €", "100 €", "—", "300 €"],
      ["9", "150 €", "100 €", "—", "250 €"],
      ["10", "100 €", "100 €", "—", "200 €"],
    ],
    specialTitle: "♟ Специальные категории",
    specialHeaders: [
      "Категория",
      "Место",
      "Magistral",
      "Challenge",
      "Blitz",
      "Итого",
    ],
    specialRows: [
      ["Женщины", "1", "700 €", "300 €", "—", "1 000 €"],
      ["Женщины", "2", "600 €", "200 €", "—", "800 €"],
      ["Женщины", "3", "500 €", "100 €", "—", "600 €"],
      ["Сеньор +50", "1", "150 €", "100 €", "100 €", "350 €"],
      ["Ветеран +65", "1", "150 €", "100 €", "100 €", "350 €"],
      ["U18", "1", "100 €", "100 €", "—", "200 €"],
      ["U16", "1", "100 €", "100 €", "—", "200 €"],
      ["U14", "1", "100 €", "100 €", "—", "200 €"],
      ["Специальные призы Туниса", "1", "200 €", "150 €", "100 €", "450 €"],
      ["Специальные призы Туниса", "2", "150 €", "100 €", "—", "250 €"],
      ["Специальные призы Туниса", "3", "100 €", "100 €", "—", "200 €"],
    ],
    grandTotalLabel: "ОБЩИЙ ПРИЗОВОЙ ФОНД",
    grandTotal: "15 020 €",
    sponsorNote:
      "Специальные тунисские денежные и натуральные призы будут объявлены позже спонсорами.",
  },
  ar: {
    generalTitle: "🏆 الترتيب العام",
    generalHeaders: ["الرتبة", "Magistral", "Challenge", "Blitz", "المجموع"],
    generalRows: [
      ["1", "3 000 €", "500 €", "300 €", "3 800 €"],
      ["2", "1 500 €", "300 €", "200 €", "2 000 €"],
      ["3", "1 000 €", "200 €", "150 €", "1 350 €"],
      ["4", "700 €", "150 €", "100 €", "950 €"],
      ["5", "500 €", "120 €", "50 €", "670 €"],
      ["6", "400 €", "100 €", "—", "500 €"],
      ["7", "300 €", "100 €", "—", "400 €"],
      ["8", "200 €", "100 €", "—", "300 €"],
      ["9", "150 €", "100 €", "—", "250 €"],
      ["10", "100 €", "100 €", "—", "200 €"],
    ],
    specialTitle: "♟ الفئات الخاصة",
    specialHeaders: [
      "الفئة",
      "الرتبة",
      "Magistral",
      "Challenge",
      "Blitz",
      "المجموع",
    ],
    specialRows: [
      ["السيدات", "1", "700 €", "300 €", "—", "1 000 €"],
      ["السيدات", "2", "600 €", "200 €", "—", "800 €"],
      ["السيدات", "3", "500 €", "100 €", "—", "600 €"],
      ["كبار السن +50", "1", "150 €", "100 €", "100 €", "350 €"],
      ["قدماء +65", "1", "150 €", "100 €", "100 €", "350 €"],
      ["U18", "1", "100 €", "100 €", "—", "200 €"],
      ["U16", "1", "100 €", "100 €", "—", "200 €"],
      ["U14", "1", "100 €", "100 €", "—", "200 €"],
      ["جوائز تونسية خاصة", "1", "200 €", "150 €", "100 €", "450 €"],
      ["جوائز تونسية خاصة", "2", "150 €", "100 €", "—", "250 €"],
      ["جوائز تونسية خاصة", "3", "100 €", "100 €", "—", "200 €"],
    ],
    grandTotalLabel: "إجمالي الجوائز",
    grandTotal: "15 020 €",
    sponsorNote:
      "سيتم الإعلان لاحقًا عن الجوائز التونسية الخاصة النقدية والعينية من طرف الرعاة.",
  },
};

const landingContent = {
  fr: {
    stats: [
      { value: "15 020 €", label: "de prix", icon: Medal },
      { value: "3", label: "tournois", icon: Crown },
      { value: "9", label: "nuits", icon: BedDouble },
      { value: "FIDE", label: "homologué", icon: Shield },
    ],
    hero: {
      eyebrow: "MEDINA",
      titleLines: ["Chess", "Festival"],
      intro:
        "Rejoindre le génial & le merveilleux. Le plaisir des échecs, la beauté de la Tunisie, trois tournois pour tous les niveaux et une expérience hôtelière premium dans la Medina.",
      venueLabel: "Festival Week",
      venueTitle: "Medina Mediterranea",
      venueText:
        "Une implantation unique entre hôtels, loisirs, souks, plage et salle de jeu plénière.",
      arrivalLabel: "Arrivée",
      departureLabel: "Départ",
      arrivalDate: "23 Oct",
      departureDate: "01 Nov",
      arrivalText: "2026 · Vendredi",
      departureText: "2026 · Dimanche",
    },
    festival: {
      index: "01",
      title: "Plus qu’un tournoi,",
      emphasis: "un voyage dans le temps",
      lead1:
        "La Medina Mediterranea – Yasmine Hammamet aura le plaisir de vous accueillir du 23 octobre au 1er novembre 2026 pour son premier festival international d’échecs. Le site réunit tournoi, hôtellerie, restauration, loisirs, marina et plage dans un même environnement.",
      lead2:
        "Trois tournois seront organisés en partenariat avec la Fédération Tunisienne des Échecs avec plus de 15 000 € de prix, une ambiance premium et une destination capable de transformer une simple participation sportive en séjour mémorable pour les joueurs et leurs accompagnateurs.",
      boxTitle: "Plus qu’un tournoi, un voyage dans le temps",
      boxLines: [
        "Flânez dans les souks, admirez les monuments, profitez de la corniche et du parc Carthage Land.",
        "Jouez votre tournoi, concentrez-vous sur votre partie et laissez vos proches profiter du séjour en toute sécurité.",
        "Entre plage, thalasso, marina, spectacles et gastronomie, l’expérience festival devient aussi une expérience destination.",
      ],
      imageCardLabel: "Medina Mediterranea",
      imageCardText:
        "Un complexe emblématique réunissant la salle du tournoi, l’hôtellerie, les loisirs et une forte identité architecturale.",
      miniCards: [
        {
          icon: Waves,
          title: "Yasmine Beach",
          text: "Une plage et une corniche qui prolongent l’expérience du séjour.",
        },
        {
          icon: CalendarDays,
          title: "10 jours d’activité",
          text: "Compétition, masterclass, animations et cérémonie de clôture.",
        },
      ],
    },
    tournaments: {
      index: "02",
      title: "Trois tournois",
      emphasis: "pour toutes les catégories",
      cards: [
        {
          icon: Crown,
          tone: "from-[#d6b25a] to-[#9f7a20]",
          title: "MAGISTRAL",
          badge: "ELO ≥ 2100",
          prize: "1er Prix · 3 000 €",
          details: [
            "9 rondes — système suisse",
            "Cadence Fischer : 1h30 + 30s/coup",
            "Homologué FIDE",
            "20 premiers échiquiers retransmis (DGT)",
            "Possibilité de réaliser des normes",
            "Inclus dans le Pack Global",
          ],
        },
        {
          icon: Trophy,
          tone: "from-[#b08735] to-[#7a5b18]",
          title: "CHALLENGE",
          badge: "ELO ≤ 2150",
          prize: "1er Prix · 500 €",
          details: [
            "9 rondes — système suisse",
            "Cadence Fischer : 1h30 + 30s/coup",
            "Homologué FIDE",
            "Résultats sur chess-results.com",
            "Inclus dans le Pack Global",
          ],
        },
        {
          icon: Sparkles,
          tone: "from-[#f7c95b] to-[#b57d10]",
          title: "BLITZ",
          badge: "Open",
          prize: "1er Prix · 300 €",
          details: [
            "11 rondes",
            "Cadence : 3 min + 2s/coup",
            "70% des droits redistribués",
            "Droit d’inscription : 20 €",
            "Vendredi 30/10 à 14h30",
            "Ouvert à tous",
          ],
        },
      ],
    },
    schedule: {
      index: "03",
      title: "Calendrier officiel",
      emphasis: "MCF 2026",
      headers: ["Jour", "Date", "Horaire", "Programme"],
      rows: [
        {
          day: "Vendredi",
          date: "23/10",
          time: "Toute la journée",
          activity: "🛬 Arrivée et accueil",
        },
        {
          day: "Samedi",
          date: "24/10",
          time: "09h00–14h00",
          activity: "🛬 Arrivée et accueil",
        },
        { day: "", date: "", time: "09h00–15h00", activity: "📋 Pointage" },
        {
          day: "",
          date: "",
          time: "15h30",
          activity: "🔒 Clôture des inscriptions",
        },
        { day: "", date: "", time: "16h00", activity: "♟ RONDE 1" },
        {
          day: "Dimanche",
          date: "25/10",
          time: "09h00–13h00",
          activity: "🎓 Masterclass / autres activités",
        },
        { day: "", date: "", time: "15h30", activity: "♟ RONDE 2" },
        { day: "Lundi", date: "26/10", time: "09h30", activity: "♟ RONDE 3" },
        { day: "", date: "", time: "15h30", activity: "♟ RONDE 4" },
        {
          day: "Mardi",
          date: "27/10",
          time: "09h00–13h00",
          activity: "🎓 Masterclass / autres activités",
        },
        { day: "", date: "", time: "15h30", activity: "♟ RONDE 5" },
        {
          day: "Mercredi",
          date: "28/10",
          time: "09h30",
          activity: "♟ RONDE 6",
        },
        { day: "", date: "", time: "15h30", activity: "♟ RONDE 7" },
        {
          day: "Jeudi",
          date: "29/10",
          time: "09h00–13h00",
          activity: "🎓 Masterclass / autres activités",
        },
        { day: "", date: "", time: "15h30", activity: "♟ RONDE 8" },
        {
          day: "Vendredi",
          date: "30/10",
          time: "09h00–13h00",
          activity: "🎭 Autres activités",
        },
        { day: "", date: "", time: "14h30", activity: "⚡ BLITZ 11 rondes" },
        { day: "Samedi", date: "31/10", time: "09h30", activity: "♟ RONDE 9" },
        { day: "", date: "", time: "17h00", activity: "🏆 Remise des prix" },
        {
          day: "Dimanche",
          date: "01/11",
          time: "Avant 12h00",
          activity: "✈ Départ",
        },
      ],
    },
    prizes: {
      index: "04",
      title: "Liste des prix",
      emphasis: "MCF 2026",
      generalTitle: "🏆 Classement général",
      generalHeaders: ["Place", "Magistral", "Challenge", "Blitz"],
      generalRows: [
        ["1°", "3 000 €", "500 €", "300 €"],
        ["2°", "1 500 €", "300 €", "200 €"],
        ["3°", "1 000 €", "200 €", "150 €"],
        ["4°", "700 €", "150 €", "100 €"],
        ["5°", "500 €", "120 €", "50 €"],
        ["6°", "400 €", "100 €", "—"],
        ["7°", "300 €", "100 €", "—"],
        ["8°", "200 €", "100 €", "—"],
        ["9°", "150 €", "100 €", "—"],
        ["10°", "100 €", "100 €", "—"],
      ],
      specialTitle: "♀ Catégorie féminine & spéciales",
      specialHeaders: ["Catégorie", "Magistral", "Challenge"],
      specialRows: [
        ["Féminin 1°", "700 €", "300 €"],
        ["Féminin 2°", "600 €", "200 €"],
        ["Féminin 3°", "500 €", "100 €"],
        ["Junior / Senior / Vétéran", "Primes dédiées", "Primes dédiées"],
      ],
      envelopeTitle: "Enveloppe globale",
      envelopeText:
        "Une répartition pensée pour valoriser le niveau sportif, encourager la participation féminine et soutenir plusieurs catégories spécifiques.",
    },
    accommodation: {
      index: "05",
      title: "Package global",
      emphasis: "9 nuits en pension complète",
      includesTitle: "Ce qui est inclus dans le package global",
      includes: [
        "Hébergement 9 nuits en pension complète",
        "Transferts aéroports – Yasmine Hammamet (aller / retour)",
        "Droits d’inscription aux tournois Magistral ou Challenge",
        "Cotisation licence FTE (15 €) prise en charge",
        "Réduction 15% sur les forfaits spa et hammam",
        "Ticket Carthage Land + pass loisirs inclus",
        "Réduction 20% sur un second ticket ou un pack famille",
        "Réduction 50% sur les excursions touristiques",
        "Une excursion touristique gratuite",
        "Accès aux masterclass et autres activités du festival",
      ],
      perPerson: "/personne",
      hotels: [
        {
          name: "Diar Lemdina Suites Hôtel",
          highlight: "Sur site · Lieu du tournoi",
          price: "690 €",
          copy: "Au cœur du complexe Medina Mediterranea, cet hôtel propose un hébergement haut de gamme dans plus de 250 suites et chambres réparties dans trois résidences prestigieuses.",
          bullets: [
            "Suite Senior : chambre double + salon",
            "Suite Ambassadeur : 2 chambres + 2 salles de bain + salon",
          ],
        },
        {
          name: "Bélisaire & Thalasso",
          highlight: "700 m du complexe · Idéal familles",
          price: "790 €",
          copy: "Une option équilibrée pour les familles, avec chambres spacieuses, accès rapide au site du tournoi, plage privée et centre de thalassothérapie.",
          bullets: [
            "Chambres adaptées PMR",
            "Plage privée à 200 mètres",
            "Vastes jardins et centre thalasso",
          ],
        },
        {
          name: "Solaria & Thalasso",
          highlight: "5 étoiles · Prestige",
          price: "990 €",
          copy: "Le séjour le plus premium du festival, pour les joueurs et accompagnateurs qui recherchent une expérience 5 étoiles et un service hôtelier raffiné.",
          bullets: [
            "Chambres deluxe avec vue mer",
            "Accès privilégié spa & thalasso",
            "Services hôteliers premium",
          ],
        },
      ],
    },
    regulation: {
      index: "06",
      title: "Règlement intérieur",
      emphasis: "MCF 2026",
      blocks: [
        {
          title: "Art. 1 — Organisation",
          items: [
            "Festival international d’échecs organisé du 23 octobre au 1er novembre 2026 à la salle Hannibal, Medina Conference & Expo Center.",
            "Deux tournois classiques homologués FIDE : Magistral et Challenge, joués en 9 rondes.",
            "Le classement tient compte du dernier Elo FIDE publié au 01/10/2026.",
            "Les 20 premiers échiquiers seront retransmis en ligne via DGT.",
          ],
        },
        {
          title: "Art. 2 — Règles du jeu & appariements",
          items: [
            "Application du règlement FIDE en vigueur et appariements au système suisse.",
            "Les appariements deviennent définitifs 2 heures après la ronde précédente sauf cas de force majeure.",
            "Le pointage sur place avant 14h30 conditionne l’appariement à la première ronde.",
            "Résultats & appariements publiés sur chess-results.com.",
          ],
        },
        {
          title: "Art. 3 — Cadence de jeu",
          items: [
            "Tournois classiques : 90 min + 30 s/coup.",
            "Blitz : 3 min + 2 s/coup.",
            "Les horaires officiels sont ceux du calendrier publié par l’organisation.",
            "Le respect du planning conditionne la qualité du déroulement sportif.",
          ],
        },
        {
          title: "Art. 5 — Forfaits & bye",
          items: [
            "Retard maximum autorisé avant forfait : 30 minutes après le début effectif de la ronde.",
            "Toute absence non notifiée peut être considérée comme un abandon du tournoi.",
            "Les feuilles de parties signées doivent être remises à l’arbitre à la fin de chaque ronde.",
          ],
        },
        {
          title: "Art. 8 — Antitriche & électronique",
          items: [
            "Téléphones, montres connectées, écouteurs et appareils Bluetooth interdits pendant la partie.",
            "Toute infraction entraîne la perte immédiate de la partie.",
            "Une solution de dépôt est prévue à l’entrée de la salle.",
          ],
        },
        {
          title: "Art. 12 — Médias",
          items: [
            "Des photos et vidéos du festival pourront être diffusées avant, pendant et après l’événement.",
            "L’inscription implique le consentement du participant ou de son représentant légal pour cette diffusion.",
            "La communication visuelle fait partie intégrante de la valorisation du festival.",
          ],
        },
      ],
    },
    sponsors: {
      index: "07",
      title: "Nos sponsors",
      emphasis: "& partenaires",
      items: [
        { icon: "🏰", name: "Diar Lemdina", type: "Hôtel partenaire" },
        { icon: "🏖", name: "Bélisaire & Thalasso", type: "Hôtel partenaire" },
        { icon: "⭐", name: "Solaria & Thalasso", type: "Hôtel partenaire" },
        {
          icon: "🎡",
          name: "Carthage Land Hammamet",
          type: "Partenaire loisirs",
        },
        { icon: "🎪", name: "Carthage Land Tunis", type: "Partenaire loisirs" },
        { icon: "➕", name: "Sponsor 6", type: "À confirmer" },
      ],
    },
    gallery: {
      index: "08",
      title: "Yasmine Hammamet",
      emphasis: "& la Medina",
      badge: "Galerie",
      items: [
        { image: hannibalImage, title: "Salle de jeu Hannibal", large: true },
        { image: medinaImage, title: "La Medina" },
        { image: beachImage, title: "La plage de Yasmine" },
        { image: soukImage, title: "Les souks" },
        {
          gradient: "from-[#1a2a3a] to-[#2d4f6a]",
          title: "La Marina",
          icon: "⛵",
          medium: true,
        },
        {
          gradient: "from-[#2a1a3a] to-[#5a2d8a]",
          title: "Carthage Land",
          icon: "🎡",
        },
      ],
    },
    contact: {
      index: "09",
      title: "Rejoignez",
      emphasis: "MCF 2026",
      infoTitle: "Informations",
      infoLines: [
        "📍 Lieu : Medina Conference & Expo Center, salle « Hannibal », Yasmine Hammamet, Tunisie",
        "📅 Dates : 23 octobre – 1er novembre 2026",
        "🌐 Site : medinachessfestival.com",
        "🏆 Homologation : FIDE · Fédération Tunisienne des Échecs",
        "👨‍⚖️ Arbitre principal : IA Slim Hammami",
      ],
      deadlineTitle: "Date limite d’inscription",
      deadlineText:
        "Jusqu’au 15 septembre 2026. Au-delà, une majoration de 10 à 15% peut s’appliquer selon la formule choisie.",
      countdownLabels: ["Jours", "Heures", "Min", "Sec"],
    },
  },
  en: {
    stats: [
      { value: "+€15,000", label: "in prizes", icon: Medal },
      { value: "3", label: "tournaments", icon: Crown },
      { value: "9", label: "nights", icon: BedDouble },
      { value: "FIDE", label: "rated", icon: Shield },
    ],
    hero: {
      eyebrow: "MEDINA",
      titleLines: ["Chess", "Festival"],
      intro:
        "Join the exceptional. Enjoy chess, discover Tunisia, choose among three tournaments for every level, and experience premium accommodation in the Medina.",
      venueLabel: "Festival Week",
      venueTitle: "Medina Mediterranea",
      venueText:
        "A unique setting combining hotels, leisure, souks, beach, and the main playing hall.",
      arrivalLabel: "Arrival",
      departureLabel: "Departure",
      arrivalDate: "23 Oct",
      departureDate: "01 Nov",
      arrivalText: "2026 · Friday",
      departureText: "2026 · Sunday",
    },
    festival: {
      index: "01",
      title: "More than a tournament,",
      emphasis: "a journey through time",
      lead1:
        "Medina Mediterranea – Yasmine Hammamet will welcome you from October 23 to November 1, 2026 for its first international chess festival. The venue combines tournament halls, hotels, restaurants, leisure attractions, marina, and beach in one destination.",
      lead2:
        "Three tournaments will be organized with the Tunisian Chess Federation, with more than €15,000 in prizes, a premium atmosphere, and a destination capable of turning a sports event into a memorable stay for players and companions.",
      boxTitle: "More than a tournament, a journey through time",
      boxLines: [
        "Stroll through the souks, admire the monuments, and enjoy the waterfront and Carthage Land park.",
        "Play your tournament in focus while your family enjoys the stay safely.",
        "Between beach, thalasso, marina, shows, and gastronomy, the festival becomes a full destination experience.",
      ],
      imageCardLabel: "Medina Mediterranea",
      imageCardText:
        "An iconic complex bringing together the tournament hall, hotels, leisure activities, and a strong architectural identity.",
      miniCards: [
        {
          icon: Waves,
          title: "Yasmine Beach",
          text: "A beach and promenade that extend the stay experience.",
        },
        {
          icon: CalendarDays,
          title: "10 days of activities",
          text: "Competition, masterclasses, entertainment, and the closing ceremony.",
        },
      ],
    },
    tournaments: {
      index: "02",
      title: "Three tournaments",
      emphasis: "for every category",
      cards: [
        {
          icon: Crown,
          tone: "from-[#d6b25a] to-[#9f7a20]",
          title: "MAGISTRAL",
          badge: "ELO ≥ 2100",
          prize: "1st Prize · €3,000",
          details: [
            "9 rounds — Swiss system",
            "Fischer time control: 1h30 + 30s/move",
            "FIDE rated",
            "Top 20 boards broadcast live (DGT)",
            "Norm chances available",
            "Included in the Global Package",
          ],
        },
        {
          icon: Trophy,
          tone: "from-[#b08735] to-[#7a5b18]",
          title: "CHALLENGE",
          badge: "ELO ≤ 2150",
          prize: "1st Prize · €500",
          details: [
            "9 rounds — Swiss system",
            "Fischer time control: 1h30 + 30s/move",
            "FIDE rated",
            "Results on chess-results.com",
            "Included in the Global Package",
          ],
        },
        {
          icon: Sparkles,
          tone: "from-[#f7c95b] to-[#b57d10]",
          title: "BLITZ",
          badge: "Open",
          prize: "1st Prize · €300",
          details: [
            "11 rounds",
            "Time control: 3 min + 2s/move",
            "70% of fees redistributed",
            "Entry fee: €20",
            "Friday 30/10 at 14:30",
            "Open to all",
          ],
        },
      ],
    },
    schedule: {
      index: "03",
      title: "Official schedule",
      emphasis: "MCF 2026",
      headers: ["Day", "Date", "Time", "Program"],
      rows: [
        {
          day: "Friday",
          date: "23/10",
          time: "All day",
          activity: "🛬 Arrival and welcome",
        },
        {
          day: "Saturday",
          date: "24/10",
          time: "09:00–14:00",
          activity: "🛬 Arrival and welcome",
        },
        { day: "", date: "", time: "09:00–15:00", activity: "📋 Check-in" },
        {
          day: "",
          date: "",
          time: "15:30",
          activity: "🔒 Registration closes",
        },
        { day: "", date: "", time: "16:00", activity: "♟ ROUND 1" },
        {
          day: "Sunday",
          date: "25/10",
          time: "09:00–13:00",
          activity: "🎓 Masterclass / side activities",
        },
        { day: "", date: "", time: "15:30", activity: "♟ ROUND 2" },
        { day: "Monday", date: "26/10", time: "09:30", activity: "♟ ROUND 3" },
        { day: "", date: "", time: "15:30", activity: "♟ ROUND 4" },
        {
          day: "Tuesday",
          date: "27/10",
          time: "09:00–13:00",
          activity: "🎓 Masterclass / side activities",
        },
        { day: "", date: "", time: "15:30", activity: "♟ ROUND 5" },
        {
          day: "Wednesday",
          date: "28/10",
          time: "09:30",
          activity: "♟ ROUND 6",
        },
        { day: "", date: "", time: "15:30", activity: "♟ ROUND 7" },
        {
          day: "Thursday",
          date: "29/10",
          time: "09:00–13:00",
          activity: "🎓 Masterclass / side activities",
        },
        { day: "", date: "", time: "15:30", activity: "♟ ROUND 8" },
        {
          day: "Friday",
          date: "30/10",
          time: "09:00–13:00",
          activity: "🎭 Side activities",
        },
        { day: "", date: "", time: "14:30", activity: "⚡ BLITZ 11 rounds" },
        {
          day: "Saturday",
          date: "31/10",
          time: "09:30",
          activity: "♟ ROUND 9",
        },
        { day: "", date: "", time: "17:00", activity: "🏆 Prize ceremony" },
        {
          day: "Sunday",
          date: "01/11",
          time: "Before 12:00",
          activity: "✈ Departure",
        },
      ],
    },
    prizes: {
      index: "04",
      title: "Prize list",
      emphasis: "MCF 2026",
      generalTitle: "🏆 Overall ranking",
      generalHeaders: ["Place", "Magistral", "Challenge", "Blitz"],
      generalRows: [
        ["1st", "€3,000", "€500", "€300"],
        ["2nd", "€1,500", "€300", "€200"],
        ["3rd", "€1,000", "€200", "€150"],
        ["4th", "€700", "€150", "€100"],
        ["5th", "€500", "€120", "€50"],
        ["6th", "€400", "€100", "—"],
        ["7th", "€300", "€100", "—"],
        ["8th", "€200", "€100", "—"],
        ["9th", "€150", "€100", "—"],
        ["10th", "€100", "€100", "—"],
      ],
      specialTitle: "♀ Women & special prizes",
      specialHeaders: ["Category", "Magistral", "Challenge"],
      specialRows: [
        ["Women 1st", "€700", "€300"],
        ["Women 2nd", "€600", "€200"],
        ["Women 3rd", "€500", "€100"],
        ["Junior / Senior / Veteran", "Dedicated prizes", "Dedicated prizes"],
      ],
      envelopeTitle: "Global prize fund",
      envelopeText:
        "A distribution designed to reward sporting level, encourage women’s participation, and support several special categories.",
    },
    accommodation: {
      index: "05",
      title: "Global package",
      emphasis: "9 nights full board",
      includesTitle: "What is included in the global package",
      includes: [
        "9 nights accommodation with full board",
        "Airport transfers – Yasmine Hammamet (round trip)",
        "Entry rights for Magistral or Challenge tournaments",
        "FTE license fee (€15) covered",
        "15% discount on spa and hammam packages",
        "Carthage Land ticket + leisure pass included",
        "20% discount on a second ticket or family pack",
        "50% discount on tourist excursions",
        "One free tourist excursion",
        "Access to masterclasses and other festival activities",
      ],
      perPerson: "/person",
      hotels: [
        {
          name: "Diar Lemdina Suites Hotel",
          highlight: "On site · tournament venue",
          price: "€690",
          copy: "At the heart of Medina Mediterranea, this hotel offers high-end accommodation in more than 250 suites and rooms spread over three prestigious residences.",
          bullets: [
            "Senior Suite: double room + lounge",
            "Ambassador Suite: 2 bedrooms + 2 bathrooms + lounge",
          ],
        },
        {
          name: "Belisaire & Thalasso",
          highlight: "700 m from the venue · family friendly",
          price: "€790",
          copy: "A balanced option for families, with spacious rooms, quick access to the venue, private beach, and a thalassotherapy center.",
          bullets: [
            "Accessible rooms available",
            "Private beach 200 meters away",
            "Large gardens and thalasso center",
          ],
        },
        {
          name: "Solaria & Thalasso",
          highlight: "5 stars · prestige",
          price: "€990",
          copy: "The festival’s most premium stay, for players and companions seeking a true 5-star experience and refined hotel service.",
          bullets: [
            "Deluxe sea-view rooms",
            "Preferred spa & thalasso access",
            "Premium hotel services",
          ],
        },
      ],
    },
    regulation: {
      index: "06",
      title: "Internal rules",
      emphasis: "MCF 2026",
      blocks: [
        {
          title: "Art. 1 — Organization",
          items: [
            "International chess festival held from October 23 to November 1, 2026 at the Hannibal hall, Medina Conference & Expo Center.",
            "Two FIDE-rated classical tournaments: Magistral and Challenge, each played over 9 rounds.",
            "The last FIDE Elo list published on 01/10/2026 will be used.",
            "The top 20 boards will be broadcast online via DGT.",
          ],
        },
        {
          title: "Art. 2 — Playing rules & pairings",
          items: [
            "Current FIDE rules apply and pairings use the Swiss system.",
            "Pairings become final 2 hours after the previous round except in force majeure cases.",
            "On-site check-in before 14:30 is required to be paired for round one.",
            "Results & pairings are published on chess-results.com.",
          ],
        },
        {
          title: "Art. 3 — Time control",
          items: [
            "Classical tournaments: 90 min + 30 s/move.",
            "Blitz: 3 min + 2 s/move.",
            "Official times are those published in the schedule.",
            "Respecting the schedule is essential for smooth sports management.",
          ],
        },
        {
          title: "Art. 5 — Forfeit & bye",
          items: [
            "Maximum delay before forfeit: 30 minutes after the actual start of the round.",
            "Any unannounced absence may be considered a withdrawal from the tournament.",
            "Signed scoresheets must be handed to the arbiter after every round.",
          ],
        },
        {
          title: "Art. 8 — Anti-cheating & electronics",
          items: [
            "Phones, smartwatches, earphones, and Bluetooth devices are forbidden during play.",
            "Any violation results in immediate loss of the game.",
            "A deposit solution is available at the entrance of the hall.",
          ],
        },
        {
          title: "Art. 12 — Media",
          items: [
            "Photos and videos of the festival may be distributed before, during, and after the event.",
            "Registration implies consent of the participant or legal representative for such distribution.",
            "Visual communication is an integral part of the festival’s promotion.",
          ],
        },
      ],
    },
    sponsors: {
      index: "07",
      title: "Our sponsors",
      emphasis: "& partners",
      items: [
        { icon: "🏰", name: "Diar Lemdina", type: "Hotel partner" },
        { icon: "🏖", name: "Belisaire & Thalasso", type: "Hotel partner" },
        { icon: "⭐", name: "Solaria & Thalasso", type: "Hotel partner" },
        { icon: "🎡", name: "Carthage Land Hammamet", type: "Leisure partner" },
        { icon: "🎪", name: "Carthage Land Tunis", type: "Leisure partner" },
        { icon: "➕", name: "Sponsor 6", type: "To be confirmed" },
      ],
    },
    gallery: {
      index: "08",
      title: "Yasmine Hammamet",
      emphasis: "& the Medina",
      badge: "Gallery",
      items: [
        { image: hannibalImage, title: "Hannibal playing hall", large: true },
        { image: medinaImage, title: "The Medina" },
        { image: beachImage, title: "Yasmine beach" },
        { image: soukImage, title: "The souks" },
        {
          gradient: "from-[#1a2a3a] to-[#2d4f6a]",
          title: "The Marina",
          icon: "⛵",
          medium: true,
        },
        {
          gradient: "from-[#2a1a3a] to-[#5a2d8a]",
          title: "Carthage Land",
          icon: "🎡",
        },
      ],
    },
    contact: {
      index: "09",
      title: "Join",
      emphasis: "MCF 2026",
      infoTitle: "Information",
      infoLines: [
        "📍 Venue: Medina Conference & Expo Center, “Hannibal” hall, Yasmine Hammamet, Tunisia",
        "📅 Dates: October 23 – November 1, 2026",
        "🌐 Website: medinachessfestival.com",
        "🏆 Approval: FIDE · Tunisian Chess Federation",
        "👨‍⚖️ Chief arbiter: IA Slim Hammami",
      ],
      deadlineTitle: "Registration deadline",
      deadlineText:
        "Until September 15, 2026. Beyond that date, an extra 10 to 15% may apply depending on the chosen formula.",
      countdownLabels: ["Days", "Hours", "Min", "Sec"],
    },
  },
  de: {
    stats: [
      { value: "15 020 €", label: "Preisgeld", icon: Medal },
      { value: "3", label: "Turniere", icon: Crown },
      { value: "9", label: "Nächte", icon: BedDouble },
      { value: "FIDE", label: "anerkannt", icon: Shield },
    ],
    hero: {
      eyebrow: "MEDINA",
      titleLines: ["Chess", "Festival"],
      intro:
        "Erleben Sie das Besondere: Schach, die Schönheit Tunesiens, drei Turniere für jedes Niveau und eine Premium-Hotelerfahrung in der Medina.",
      venueLabel: "Festival Week",
      venueTitle: "Medina Mediterranea",
      venueText:
        "Ein einzigartiger Standort mit Hotels, Freizeit, Souks, Strand und der großen Spielhalle.",
      arrivalLabel: "Anreise",
      departureLabel: "Abreise",
      arrivalDate: "23 Okt",
      departureDate: "01 Nov",
      arrivalText: "2026 · Freitag",
      departureText: "2026 · Sonntag",
    },
    festival: {
      index: "01",
      title: "Mehr als ein Turnier,",
      emphasis: "eine Reise durch die Zeit",
      lead1:
        "Die Medina Mediterranea – Yasmine Hammamet empfängt Sie vom 23. Oktober bis 1. November 2026 zu ihrem ersten internationalen Schachfestival. Der Ort vereint Turnier, Hotellerie, Restaurants, Freizeit, Marina und Strand in einem einzigen Umfeld.",
      lead2:
        "Drei Turniere werden gemeinsam mit dem Tunesischen Schachverband organisiert, mit mehr als 15 000 € Preisgeld, Premium-Atmosphäre und einem Reiseziel, das eine sportliche Teilnahme in einen unvergesslichen Aufenthalt verwandeln kann.",
      boxTitle: "Mehr als ein Turnier, eine Reise durch die Zeit",
      boxLines: [
        "Spazieren Sie durch die Souks, bewundern Sie die Architektur und genießen Sie die Promenade und den Carthage-Land-Park.",
        "Spielen Sie Ihr Turnier konzentriert, während Ihre Familie den Aufenthalt sicher genießt.",
        "Zwischen Strand, Thalasso, Marina, Shows und Gastronomie wird das Festival zu einem echten Reiseziel.",
      ],
      imageCardLabel: "Medina Mediterranea",
      imageCardText:
        "Ein symbolträchtiger Komplex mit Turniersaal, Hotels, Freizeitangeboten und starker architektonischer Identität.",
      miniCards: [
        {
          icon: Waves,
          title: "Yasmine Beach",
          text: "Ein Strand und eine Promenade, die das Aufenthaltserlebnis verlängern.",
        },
        {
          icon: CalendarDays,
          title: "10 Tage Aktivitäten",
          text: "Wettkampf, Masterclasses, Animationen und Abschlusszeremonie.",
        },
      ],
    },
    tournaments: {
      index: "02",
      title: "Drei Turniere",
      emphasis: "für alle Kategorien",
      cards: [
        {
          icon: Crown,
          tone: "from-[#d6b25a] to-[#9f7a20]",
          title: "MAGISTRAL",
          badge: "ELO ≥ 2100",
          prize: "1. Preis · 3 000 €",
          details: [
            "9 Runden — Schweizer System",
            "Fischer-Bedenkzeit: 1h30 + 30s/Zug",
            "FIDE anerkannt",
            "Top-20-Bretter live übertragen (DGT)",
            "Normen sind möglich",
            "Im Globalpaket enthalten",
          ],
        },
        {
          icon: Trophy,
          tone: "from-[#b08735] to-[#7a5b18]",
          title: "CHALLENGE",
          badge: "ELO ≤ 2150",
          prize: "1. Preis · 500 €",
          details: [
            "9 Runden — Schweizer System",
            "Fischer-Bedenkzeit: 1h30 + 30s/Zug",
            "FIDE anerkannt",
            "Ergebnisse auf chess-results.com",
            "Im Globalpaket enthalten",
          ],
        },
        {
          icon: Sparkles,
          tone: "from-[#f7c95b] to-[#b57d10]",
          title: "BLITZ",
          badge: "Offen",
          prize: "1. Preis · 300 €",
          details: [
            "11 Runden",
            "Bedenkzeit: 3 Min + 2s/Zug",
            "70% der Gebühren werden ausgeschüttet",
            "Startgeld: 20 €",
            "Freitag 30/10 um 14:30",
            "Offen für alle",
          ],
        },
      ],
    },
    schedule: {
      index: "03",
      title: "Offizieller Kalender",
      emphasis: "MCF 2026",
      headers: ["Tag", "Datum", "Zeit", "Programm"],
      rows: [
        {
          day: "Freitag",
          date: "23/10",
          time: "Ganztägig",
          activity: "🛬 Ankunft und Empfang",
        },
        {
          day: "Samstag",
          date: "24/10",
          time: "09:00–14:00",
          activity: "🛬 Ankunft und Empfang",
        },
        { day: "", date: "", time: "09:00–15:00", activity: "📋 Check-in" },
        { day: "", date: "", time: "15:30", activity: "🔒 Anmeldeschluss" },
        { day: "", date: "", time: "16:00", activity: "♟ RUNDE 1" },
        {
          day: "Sonntag",
          date: "25/10",
          time: "09:00–13:00",
          activity: "🎓 Masterclass / Nebenaktivitäten",
        },
        { day: "", date: "", time: "15:30", activity: "♟ RUNDE 2" },
        { day: "Montag", date: "26/10", time: "09:30", activity: "♟ RUNDE 3" },
        { day: "", date: "", time: "15:30", activity: "♟ RUNDE 4" },
        {
          day: "Dienstag",
          date: "27/10",
          time: "09:00–13:00",
          activity: "🎓 Masterclass / Nebenaktivitäten",
        },
        { day: "", date: "", time: "15:30", activity: "♟ RUNDE 5" },
        {
          day: "Mittwoch",
          date: "28/10",
          time: "09:30",
          activity: "♟ RUNDE 6",
        },
        { day: "", date: "", time: "15:30", activity: "♟ RUNDE 7" },
        {
          day: "Donnerstag",
          date: "29/10",
          time: "09:00–13:00",
          activity: "🎓 Masterclass / Nebenaktivitäten",
        },
        { day: "", date: "", time: "15:30", activity: "♟ RUNDE 8" },
        {
          day: "Freitag",
          date: "30/10",
          time: "09:00–13:00",
          activity: "🎭 Weitere Aktivitäten",
        },
        { day: "", date: "", time: "14:30", activity: "⚡ BLITZ 11 Runden" },
        { day: "Samstag", date: "31/10", time: "09:30", activity: "♟ RUNDE 9" },
        { day: "", date: "", time: "17:00", activity: "🏆 Siegerehrung" },
        {
          day: "Sonntag",
          date: "01/11",
          time: "Vor 12:00",
          activity: "✈ Abreise",
        },
      ],
    },
    prizes: {
      index: "04",
      title: "Preisliste",
      emphasis: "MCF 2026",
      generalTitle: "🏆 Gesamtwertung",
      generalHeaders: ["Platz", "Magistral", "Challenge", "Blitz"],
      generalRows: [
        ["1.", "3 000 €", "500 €", "300 €"],
        ["2.", "1 500 €", "300 €", "200 €"],
        ["3.", "1 000 €", "200 €", "150 €"],
        ["4.", "700 €", "150 €", "100 €"],
        ["5.", "500 €", "120 €", "50 €"],
        ["6.", "400 €", "100 €", "—"],
        ["7.", "300 €", "100 €", "—"],
        ["8.", "200 €", "100 €", "—"],
        ["9.", "150 €", "100 €", "—"],
        ["10.", "100 €", "100 €", "—"],
      ],
      specialTitle: "♀ Damen & Sonderpreise",
      specialHeaders: ["Kategorie", "Magistral", "Challenge"],
      specialRows: [
        ["Damen 1.", "700 €", "300 €"],
        ["Damen 2.", "600 €", "200 €"],
        ["Damen 3.", "500 €", "100 €"],
        ["Junior / Senior / Veteran", "Sonderprämien", "Sonderprämien"],
      ],
      envelopeTitle: "Gesamtes Preisgeld",
      envelopeText:
        "Eine Verteilung, die die sportliche Leistung aufwertet, die Teilnahme von Frauen fördert und mehrere besondere Kategorien unterstützt.",
    },
    accommodation: {
      index: "05",
      title: "Globales Paket",
      emphasis: "9 Nächte Vollpension",
      includesTitle: "Was im globalen Paket enthalten ist",
      includes: [
        "9 Nächte Unterkunft mit Vollpension",
        "Flughafentransfers – Yasmine Hammamet (Hin- und Rückfahrt)",
        "Startrechte für Magistral oder Challenge",
        "FTE-Lizenzgebühr (15 €) übernommen",
        "15% Rabatt auf Spa- und Hammam-Pakete",
        "Carthage-Land-Ticket + Freizeitpass inklusive",
        "20% Rabatt auf ein zweites Ticket oder Familienpaket",
        "50% Rabatt auf touristische Ausflüge",
        "Ein kostenloser touristischer Ausflug",
        "Zugang zu Masterclasses und weiteren Festivalaktivitäten",
      ],
      perPerson: "/Person",
      hotels: [
        {
          name: "Diar Lemdina Suites Hotel",
          highlight: "Vor Ort · Turnierort",
          price: "690 €",
          copy: "Im Herzen der Medina Mediterranea bietet dieses Hotel hochwertige Unterkünfte in mehr als 250 Suiten und Zimmern, verteilt auf drei prestigeträchtige Residenzen.",
          bullets: [
            "Senior Suite: Doppelzimmer + Salon",
            "Ambassador Suite: 2 Schlafzimmer + 2 Bäder + Salon",
          ],
        },
        {
          name: "Belisaire & Thalasso",
          highlight: "700 m vom Komplex · ideal für Familien",
          price: "790 €",
          copy: "Eine ausgewogene Option für Familien mit großzügigen Zimmern, schnellem Zugang zum Turnierort, Privatstrand und Thalassotherapie-Zentrum.",
          bullets: [
            "Barrierefreie Zimmer verfügbar",
            "Privatstrand in 200 Metern Entfernung",
            "Große Gärten und Thalasso-Zentrum",
          ],
        },
        {
          name: "Solaria & Thalasso",
          highlight: "5 Sterne · Prestige",
          price: "990 €",
          copy: "Der exklusivste Aufenthalt des Festivals für Spieler und Begleiter, die ein echtes 5-Sterne-Erlebnis und raffinierten Hotelservice suchen.",
          bullets: [
            "Deluxe-Zimmer mit Meerblick",
            "Bevorzugter Zugang zu Spa & Thalasso",
            "Premium-Hotelservices",
          ],
        },
      ],
    },
    regulation: {
      index: "06",
      title: "Hausordnung",
      emphasis: "MCF 2026",
      blocks: [
        {
          title: "Art. 1 — Organisation",
          items: [
            "Internationales Schachfestival vom 23. Oktober bis 1. November 2026 im Hannibal-Saal des Medina Conference & Expo Center.",
            "Zwei FIDE-anerkannte klassische Turniere: Magistral und Challenge mit je 9 Runden.",
            "Maßgeblich ist die letzte FIDE-Elo-Liste vom 01.10.2026.",
            "Die ersten 20 Bretter werden online über DGT übertragen.",
          ],
        },
        {
          title: "Art. 2 — Spielregeln & Paarungen",
          items: [
            "Es gelten die aktuellen FIDE-Regeln, gepaart wird im Schweizer System.",
            "Paarungen werden 2 Stunden nach der vorherigen Runde endgültig, außer bei höherer Gewalt.",
            "Check-in vor Ort vor 14:30 ist Voraussetzung für die Paarung zur ersten Runde.",
            "Ergebnisse und Paarungen werden auf chess-results.com veröffentlicht.",
          ],
        },
        {
          title: "Art. 3 — Bedenkzeit",
          items: [
            "Klassische Turniere: 90 Min + 30 Sek/Zug.",
            "Blitz: 3 Min + 2 Sek/Zug.",
            "Offizielle Zeiten sind diejenigen des veröffentlichten Kalenders.",
            "Die Einhaltung des Zeitplans ist für einen reibungslosen Ablauf wesentlich.",
          ],
        },
        {
          title: "Art. 5 — kampflos & Bye",
          items: [
            "Maximale Verspätung vor kampfloser Niederlage: 30 Minuten nach tatsächlichem Rundenbeginn.",
            "Jede unangekündigte Abwesenheit kann als Turnieraufgabe betrachtet werden.",
            "Unterschriebene Partiebögen sind nach jeder Runde beim Schiedsrichter abzugeben.",
          ],
        },
        {
          title: "Art. 8 — Anti-Cheating & Elektronik",
          items: [
            "Telefone, Smartwatches, Kopfhörer und Bluetooth-Geräte sind während der Partie verboten.",
            "Jeder Verstoß führt zum sofortigen Partieverlust.",
            "Am Eingang des Saals steht eine Abgabemöglichkeit bereit.",
          ],
        },
        {
          title: "Art. 12 — Medien",
          items: [
            "Fotos und Videos des Festivals können vor, während und nach der Veranstaltung verbreitet werden.",
            "Mit der Anmeldung stimmt der Teilnehmer bzw. gesetzliche Vertreter dieser Verbreitung zu.",
            "Die visuelle Kommunikation ist ein integraler Bestandteil der Festivalförderung.",
          ],
        },
      ],
    },
    sponsors: {
      index: "07",
      title: "Unsere Sponsoren",
      emphasis: "& Partner",
      items: [
        { icon: "🏰", name: "Diar Lemdina", type: "Hotelpartner" },
        { icon: "🏖", name: "Belisaire & Thalasso", type: "Hotelpartner" },
        { icon: "⭐", name: "Solaria & Thalasso", type: "Hotelpartner" },
        { icon: "🎡", name: "Carthage Land Hammamet", type: "Freizeitpartner" },
        { icon: "🎪", name: "Carthage Land Tunis", type: "Freizeitpartner" },
        { icon: "➕", name: "Sponsor 6", type: "Noch zu bestätigen" },
      ],
    },
    gallery: {
      index: "08",
      title: "Yasmine Hammamet",
      emphasis: "& die Medina",
      badge: "Galerie",
      items: [
        { image: hannibalImage, title: "Spielsaal Hannibal", large: true },
        { image: medinaImage, title: "Die Medina" },
        { image: beachImage, title: "Strand von Yasmine" },
        { image: soukImage, title: "Die Souks" },
        {
          gradient: "from-[#1a2a3a] to-[#2d4f6a]",
          title: "Die Marina",
          icon: "⛵",
          medium: true,
        },
        {
          gradient: "from-[#2a1a3a] to-[#5a2d8a]",
          title: "Carthage Land",
          icon: "🎡",
        },
      ],
    },
    contact: {
      index: "09",
      title: "Seien Sie dabei",
      emphasis: "MCF 2026",
      infoTitle: "Informationen",
      infoLines: [
        "📍 Ort: Medina Conference & Expo Center, Saal „Hannibal“, Yasmine Hammamet, Tunesien",
        "📅 Daten: 23. Oktober – 1. November 2026",
        "🌐 Website: medinachessfestival.com",
        "🏆 Anerkennung: FIDE · Tunesischer Schachverband",
        "👨‍⚖️ Hauptschiedsrichter: IA Slim Hammami",
      ],
      deadlineTitle: "Anmeldeschluss",
      deadlineText:
        "Bis zum 15. September 2026. Danach kann je nach gewählter Formel ein Aufschlag von 10 bis 15% gelten.",
      countdownLabels: ["Tage", "Stunden", "Min", "Sek"],
    },
  },
  ru: {
    stats: [
      { value: "15 020 €", label: "призовой фонд", icon: Medal },
      { value: "3", label: "турнира", icon: Crown },
      { value: "9", label: "ночей", icon: BedDouble },
      { value: "FIDE", label: "рейтинг", icon: Shield },
    ],
    hero: {
      eyebrow: "MEDINA",
      titleLines: ["Chess", "Festival"],
      intro:
        "Насладитесь шахматами, красотой Туниса, тремя турнирами для любого уровня и премиальным размещением в Медине.",
      venueLabel: "Festival Week",
      venueTitle: "Medina Mediterranea",
      venueText:
        "Уникальная площадка с отелями, развлечениями, базарами, пляжем и главным игровым залом.",
      arrivalLabel: "Прибытие",
      departureLabel: "Отъезд",
      arrivalDate: "23 Окт",
      departureDate: "01 Ноя",
      arrivalText: "2026 · Пятница",
      departureText: "2026 · Воскресенье",
    },
    festival: {
      index: "01",
      title: "Это больше, чем турнир,",
      emphasis: "это путешествие во времени",
      lead1:
        "Medina Mediterranea – Yasmine Hammamet примет гостей с 23 октября по 1 ноября 2026 года на первом международном шахматном фестивале. Здесь объединены турнир, отели, рестораны, развлечения, марина и пляж в одном месте.",
      lead2:
        "Три турнира будут организованы совместно с Федерацией шахмат Туниса, с призовым фондом более 15 000 €, премиальной атмосферой и направлением, которое превращает спортивное участие в запоминающееся путешествие.",
      boxTitle: "Больше чем турнир, это путешествие во времени",
      boxLines: [
        "Прогуляйтесь по сукам, полюбуйтесь архитектурой и насладитесь набережной и парком Carthage Land.",
        "Играйте свой турнир сосредоточенно, пока ваши близкие безопасно наслаждаются отдыхом.",
        "Пляж, талассо, марина, шоу и гастрономия делают фестиваль настоящим туристическим опытом.",
      ],
      imageCardLabel: "Medina Mediterranea",
      imageCardText:
        "Знаковый комплекс, объединяющий турнирный зал, отели, досуг и яркую архитектурную идентичность.",
      miniCards: [
        {
          icon: Waves,
          title: "Yasmine Beach",
          text: "Пляж и набережная, которые продолжают впечатление от отдыха.",
        },
        {
          icon: CalendarDays,
          title: "10 дней активностей",
          text: "Соревнования, мастер-классы, развлечения и церемония закрытия.",
        },
      ],
    },
    tournaments: {
      index: "02",
      title: "Три турнира",
      emphasis: "для всех категорий",
      cards: [
        {
          icon: Crown,
          tone: "from-[#d6b25a] to-[#9f7a20]",
          title: "MAGISTRAL",
          badge: "ELO ≥ 2100",
          prize: "1-й приз · 3 000 €",
          details: [
            "9 туров — швейцарская система",
            "Контроль Фишера: 1ч30 + 30с/ход",
            "Рейтинг FIDE",
            "Трансляция первых 20 досок (DGT)",
            "Возможность выполнить нормы",
            "Входит в Global Package",
          ],
        },
        {
          icon: Trophy,
          tone: "from-[#b08735] to-[#7a5b18]",
          title: "CHALLENGE",
          badge: "ELO ≤ 2150",
          prize: "1-й приз · 500 €",
          details: [
            "9 туров — швейцарская система",
            "Контроль Фишера: 1ч30 + 30с/ход",
            "Рейтинг FIDE",
            "Результаты на chess-results.com",
            "Входит в Global Package",
          ],
        },
        {
          icon: Sparkles,
          tone: "from-[#f7c95b] to-[#b57d10]",
          title: "BLITZ",
          badge: "Open",
          prize: "1-й приз · 300 €",
          details: [
            "11 туров",
            "Контроль: 3 мин + 2с/ход",
            "70% взносов распределяется",
            "Взнос: 20 €",
            "Пятница 30/10 в 14:30",
            "Открыт для всех",
          ],
        },
      ],
    },
    schedule: {
      index: "03",
      title: "Официальное расписание",
      emphasis: "MCF 2026",
      headers: ["День", "Дата", "Время", "Программа"],
      rows: [
        {
          day: "Пятница",
          date: "23/10",
          time: "Весь день",
          activity: "🛬 Прибытие и встреча",
        },
        {
          day: "Суббота",
          date: "24/10",
          time: "09:00–14:00",
          activity: "🛬 Прибытие и встреча",
        },
        {
          day: "",
          date: "",
          time: "09:00–15:00",
          activity: "📋 Регистрация на месте",
        },
        {
          day: "",
          date: "",
          time: "15:30",
          activity: "🔒 Закрытие регистрации",
        },
        { day: "", date: "", time: "16:00", activity: "♟ ТУР 1" },
        {
          day: "Воскресенье",
          date: "25/10",
          time: "09:00–13:00",
          activity: "🎓 Мастер-класс / дополнительные активности",
        },
        { day: "", date: "", time: "15:30", activity: "♟ ТУР 2" },
        {
          day: "Понедельник",
          date: "26/10",
          time: "09:30",
          activity: "♟ ТУР 3",
        },
        { day: "", date: "", time: "15:30", activity: "♟ ТУР 4" },
        {
          day: "Вторник",
          date: "27/10",
          time: "09:00–13:00",
          activity: "🎓 Мастер-класс / дополнительные активности",
        },
        { day: "", date: "", time: "15:30", activity: "♟ ТУР 5" },
        { day: "Среда", date: "28/10", time: "09:30", activity: "♟ ТУР 6" },
        { day: "", date: "", time: "15:30", activity: "♟ ТУР 7" },
        {
          day: "Четверг",
          date: "29/10",
          time: "09:00–13:00",
          activity: "🎓 Мастер-класс / дополнительные активности",
        },
        { day: "", date: "", time: "15:30", activity: "♟ ТУР 8" },
        {
          day: "Пятница",
          date: "30/10",
          time: "09:00–13:00",
          activity: "🎭 Дополнительные активности",
        },
        { day: "", date: "", time: "14:30", activity: "⚡ BLITZ 11 туров" },
        { day: "Суббота", date: "31/10", time: "09:30", activity: "♟ ТУР 9" },
        {
          day: "",
          date: "",
          time: "17:00",
          activity: "🏆 Церемония награждения",
        },
        {
          day: "Воскресенье",
          date: "01/11",
          time: "До 12:00",
          activity: "✈ Отъезд",
        },
      ],
    },
    prizes: {
      index: "04",
      title: "Призовой список",
      emphasis: "MCF 2026",
      generalTitle: "🏆 Общий зачёт",
      generalHeaders: ["Место", "Magistral", "Challenge", "Blitz"],
      generalRows: [
        ["1", "3 000 €", "500 €", "300 €"],
        ["2", "1 500 €", "300 €", "200 €"],
        ["3", "1 000 €", "200 €", "150 €"],
        ["4", "700 €", "150 €", "100 €"],
        ["5", "500 €", "120 €", "50 €"],
        ["6", "400 €", "100 €", "—"],
        ["7", "300 €", "100 €", "—"],
        ["8", "200 €", "100 €", "—"],
        ["9", "150 €", "100 €", "—"],
        ["10", "100 €", "100 €", "—"],
      ],
      specialTitle: "♀ Женские и специальные призы",
      specialHeaders: ["Категория", "Magistral", "Challenge"],
      specialRows: [
        ["Женщины 1", "700 €", "300 €"],
        ["Женщины 2", "600 €", "200 €"],
        ["Женщины 3", "500 €", "100 €"],
        [
          "Юниоры / Сеньоры / Ветераны",
          "Специальные призы",
          "Специальные призы",
        ],
      ],
      envelopeTitle: "Общий призовой фонд",
      envelopeText:
        "Распределение построено так, чтобы подчеркнуть спортивный уровень, поощрить участие женщин и поддержать несколько специальных категорий.",
    },
    accommodation: {
      index: "05",
      title: "Глобальный пакет",
      emphasis: "9 ночей полный пансион",
      includesTitle: "Что входит в глобальный пакет",
      includes: [
        "Проживание 9 ночей с полным пансионом",
        "Трансферы из аэропорта – Yasmine Hammamet (туда и обратно)",
        "Права участия в турнирах Magistral или Challenge",
        "Лицензия FTE (15 €) оплачивается",
        "Скидка 15% на spa и hammam",
        "Билет в Carthage Land + leisure pass включены",
        "Скидка 20% на второй билет или семейный пакет",
        "Скидка 50% на туристические экскурсии",
        "Одна бесплатная экскурсия",
        "Доступ к мастер-классам и другим активностям фестиваля",
      ],
      perPerson: "/чел.",
      hotels: [
        {
          name: "Diar Lemdina Suites Hotel",
          highlight: "На территории · место турнира",
          price: "690 €",
          copy: "В самом центре Medina Mediterranea этот отель предлагает высококлассное размещение в более чем 250 люксах и номерах, расположенных в трёх престижных резиденциях.",
          bullets: [
            "Senior Suite: двухместный номер + салон",
            "Ambassador Suite: 2 спальни + 2 ванные + салон",
          ],
        },
        {
          name: "Belisaire & Thalasso",
          highlight: "700 м от комплекса · идеально для семей",
          price: "790 €",
          copy: "Сбалансированный вариант для семей: просторные номера, быстрый доступ к месту турнира, частный пляж и центр талассотерапии.",
          bullets: [
            "Номера для людей с ограниченной подвижностью",
            "Частный пляж в 200 метрах",
            "Большие сады и центр талассотерапии",
          ],
        },
        {
          name: "Solaria & Thalasso",
          highlight: "5 звёзд · престиж",
          price: "990 €",
          copy: "Самое премиальное проживание фестиваля для игроков и сопровождающих, которые ищут настоящий 5-звёздочный сервис.",
          bullets: [
            "Номера deluxe с видом на море",
            "Приоритетный доступ к spa & thalasso",
            "Премиальные гостиничные услуги",
          ],
        },
      ],
    },
    regulation: {
      index: "06",
      title: "Внутренний регламент",
      emphasis: "MCF 2026",
      blocks: [
        {
          title: "Ст. 1 — Организация",
          items: [
            "Международный шахматный фестиваль проводится с 23 октября по 1 ноября 2026 года в зале Hannibal, Medina Conference & Expo Center.",
            "Два классических рейтинговых турнира FIDE: Magistral и Challenge, по 9 туров каждый.",
            "Используется последний список Elo FIDE, опубликованный 01/10/2026.",
            "Первые 20 досок будут транслироваться онлайн через DGT.",
          ],
        },
        {
          title: "Ст. 2 — Правила игры и жеребьёвка",
          items: [
            "Применяются действующие правила FIDE, жеребьёвка по швейцарской системе.",
            "Жеребьёвка становится окончательной через 2 часа после предыдущего тура, кроме форс-мажора.",
            "Отметка на месте до 14:30 обязательна для попадания в первый тур.",
            "Результаты и жеребьёвка публикуются на chess-results.com.",
          ],
        },
        {
          title: "Ст. 3 — Контроль времени",
          items: [
            "Классические турниры: 90 мин + 30 сек/ход.",
            "Блиц: 3 мин + 2 сек/ход.",
            "Официальными считаются времена из опубликованного расписания.",
            "Соблюдение графика важно для качественной организации соревнования.",
          ],
        },
        {
          title: "Ст. 5 — Неявка и bye",
          items: [
            "Максимальная задержка до поражения без игры: 30 минут после фактического начала тура.",
            "Любое отсутствие без уведомления может считаться снятием с турнира.",
            "Подписанные бланки партий должны передаваться арбитру после каждого тура.",
          ],
        },
        {
          title: "Ст. 8 — Античитинг и электроника",
          items: [
            "Телефоны, умные часы, наушники и Bluetooth-устройства запрещены во время партии.",
            "Любое нарушение ведёт к немедленному поражению.",
            "На входе в зал предусмотрено место для сдачи устройств.",
          ],
        },
        {
          title: "Ст. 12 — Медиа",
          items: [
            "Фотографии и видео фестиваля могут распространяться до, во время и после мероприятия.",
            "Регистрация означает согласие участника или законного представителя на такое распространение.",
            "Визуальная коммуникация является важной частью продвижения фестиваля.",
          ],
        },
      ],
    },
    sponsors: {
      index: "07",
      title: "Наши спонсоры",
      emphasis: "& партнёры",
      items: [
        { icon: "🏰", name: "Diar Lemdina", type: "Партнёр-отель" },
        { icon: "🏖", name: "Belisaire & Thalasso", type: "Партнёр-отель" },
        { icon: "⭐", name: "Solaria & Thalasso", type: "Партнёр-отель" },
        {
          icon: "🎡",
          name: "Carthage Land Hammamet",
          type: "Партнёр по досугу",
        },
        { icon: "🎪", name: "Carthage Land Tunis", type: "Партнёр по досугу" },
        { icon: "➕", name: "Sponsor 6", type: "Будет подтверждено" },
      ],
    },
    gallery: {
      index: "08",
      title: "Yasmine Hammamet",
      emphasis: "& Медина",
      badge: "Галерея",
      items: [
        { image: hannibalImage, title: "Игровой зал Hannibal", large: true },
        { image: medinaImage, title: "Медина" },
        { image: beachImage, title: "Пляж Yasmine" },
        { image: soukImage, title: "Суки" },
        {
          gradient: "from-[#1a2a3a] to-[#2d4f6a]",
          title: "Марина",
          icon: "⛵",
          medium: true,
        },
        {
          gradient: "from-[#2a1a3a] to-[#5a2d8a]",
          title: "Carthage Land",
          icon: "🎡",
        },
      ],
    },
    contact: {
      index: "09",
      title: "Присоединяйтесь к",
      emphasis: "MCF 2026",
      infoTitle: "Информация",
      infoLines: [
        "📍 Место: Medina Conference & Expo Center, зал «Hannibal», Yasmine Hammamet, Tunisia",
        "📅 Даты: 23 октября – 1 ноября 2026",
        "🌐 Сайт: medinachessfestival.com",
        "🏆 Аккредитация: FIDE · Федерация шахмат Туниса",
        "👨‍⚖️ Главный арбитр: IA Slim Hammami",
      ],
      deadlineTitle: "Крайний срок регистрации",
      deadlineText:
        "До 15 сентября 2026 года. После этой даты может применяться надбавка от 10 до 15% в зависимости от выбранного варианта.",
      countdownLabels: ["Дни", "Часы", "Мин", "Сек"],
    },
  },
  ar: {
    stats: [
      { value: "15 020 €", label: "جوائز", icon: Medal },
      { value: "3", label: "دورات", icon: Crown },
      { value: "9", label: "ليالٍ", icon: BedDouble },
      { value: "FIDE", label: "معتمد", icon: Shield },
    ],
    hero: {
      eyebrow: "MEDINA",
      titleLines: ["Chess", "Festival"],
      intro:
        "استمتع بالشطرنج وجمال تونس وثلاث دورات لكل المستويات وتجربة إقامة راقية داخل المدينة المتوسطية.",
      venueLabel: "Festival Week",
      venueTitle: "Medina Mediterranea",
      venueText:
        "موقع فريد يجمع الفنادق والترفيه والأسواق والشاطئ وقاعة اللعب الرئيسية.",
      arrivalLabel: "الوصول",
      departureLabel: "المغادرة",
      arrivalDate: "23 أكتوبر",
      departureDate: "01 نوفمبر",
      arrivalText: "2026 · الجمعة",
      departureText: "2026 · الأحد",
    },
    festival: {
      index: "01",
      title: "أكثر من دورة،",
      emphasis: "إنها رحلة عبر الزمن",
      lead1:
        "ستستقبلك Medina Mediterranea – Yasmine Hammamet من 23 أكتوبر إلى 1 نوفمبر 2026 في أول مهرجان دولي للشطرنج. يجمع الموقع بين البطولة والفندقة والمطاعم والترفيه والمارينا والشاطئ في وجهة واحدة.",
      lead2:
        "سيتم تنظيم ثلاث دورات بالشراكة مع الجامعة التونسية للشطرنج مع جوائز تتجاوز 15 000 € وأجواء راقية ووجهة قادرة على تحويل المشاركة الرياضية إلى إقامة لا تُنسى للاعبين ومرافقيهم.",
      boxTitle: "أكثر من دورة، إنها رحلة عبر الزمن",
      boxLines: [
        "تجوّل في الأسواق واستمتع بالمعمار والواجهة البحرية وحديقة قرطاج لاند.",
        "العب بطولتك بتركيز واترك عائلتك تستمتع بالإقامة بأمان.",
        "بين الشاطئ والتالاسو والمارينا والعروض وفنون الطهو يصبح المهرجان تجربة سفر متكاملة.",
      ],
      imageCardLabel: "Medina Mediterranea",
      imageCardText:
        "مركب مميز يجمع قاعة البطولة والفنادق ووسائل الترفيه وهوية معمارية قوية.",
      miniCards: [
        {
          icon: Waves,
          title: "Yasmine Beach",
          text: "شاطئ وكورنيش يمددان متعة الإقامة.",
        },
        {
          icon: CalendarDays,
          title: "10 أيام من الأنشطة",
          text: "منافسات وماستر كلاس وتنشيط وحفل اختتام.",
        },
      ],
    },
    tournaments: {
      index: "02",
      title: "ثلاث دورات",
      emphasis: "لكل الفئات",
      cards: [
        {
          icon: Crown,
          tone: "from-[#d6b25a] to-[#9f7a20]",
          title: "MAGISTRAL",
          badge: "ELO ≥ 2100",
          prize: "الجائزة الأولى · 3 000 €",
          details: [
            "9 جولات — نظام سويسري",
            "وتيرة فيشر: 1س30 + 30ث/نقلة",
            "معتمد من FIDE",
            "نقل مباشر لأول 20 رقعة (DGT)",
            "إمكانية تحقيق معايير دولية",
            "مضمن في الباقة الشاملة",
          ],
        },
        {
          icon: Trophy,
          tone: "from-[#b08735] to-[#7a5b18]",
          title: "CHALLENGE",
          badge: "ELO ≤ 2150",
          prize: "الجائزة الأولى · 500 €",
          details: [
            "9 جولات — نظام سويسري",
            "وتيرة فيشر: 1س30 + 30ث/نقلة",
            "معتمد من FIDE",
            "النتائج على chess-results.com",
            "مضمن في الباقة الشاملة",
          ],
        },
        {
          icon: Sparkles,
          tone: "from-[#f7c95b] to-[#b57d10]",
          title: "BLITZ",
          badge: "Open",
          prize: "الجائزة الأولى · 300 €",
          details: [
            "11 جولة",
            "الوتيرة: 3 دقائق + 2ث/نقلة",
            "70% من المعاليم يعاد توزيعها",
            "معاليم التسجيل: 20 €",
            "الجمعة 30/10 على 14:30",
            "مفتوح للجميع",
          ],
        },
      ],
    },
    schedule: {
      index: "03",
      title: "البرنامج الرسمي",
      emphasis: "MCF 2026",
      headers: ["اليوم", "التاريخ", "الوقت", "البرنامج"],
      rows: [
        {
          day: "الجمعة",
          date: "23/10",
          time: "طوال اليوم",
          activity: "🛬 الوصول والاستقبال",
        },
        {
          day: "السبت",
          date: "24/10",
          time: "09:00–14:00",
          activity: "🛬 الوصول والاستقبال",
        },
        { day: "", date: "", time: "09:00–15:00", activity: "📋 تثبيت الحضور" },
        { day: "", date: "", time: "15:30", activity: "🔒 غلق التسجيل" },
        { day: "", date: "", time: "16:00", activity: "♟ الجولة 1" },
        {
          day: "الأحد",
          date: "25/10",
          time: "09:00–13:00",
          activity: "🎓 ماستر كلاس / أنشطة موازية",
        },
        { day: "", date: "", time: "15:30", activity: "♟ الجولة 2" },
        {
          day: "الاثنين",
          date: "26/10",
          time: "09:30",
          activity: "♟ الجولة 3",
        },
        { day: "", date: "", time: "15:30", activity: "♟ الجولة 4" },
        {
          day: "الثلاثاء",
          date: "27/10",
          time: "09:00–13:00",
          activity: "🎓 ماستر كلاس / أنشطة موازية",
        },
        { day: "", date: "", time: "15:30", activity: "♟ الجولة 5" },
        {
          day: "الأربعاء",
          date: "28/10",
          time: "09:30",
          activity: "♟ الجولة 6",
        },
        { day: "", date: "", time: "15:30", activity: "♟ الجولة 7" },
        {
          day: "الخميس",
          date: "29/10",
          time: "09:00–13:00",
          activity: "🎓 ماستر كلاس / أنشطة موازية",
        },
        { day: "", date: "", time: "15:30", activity: "♟ الجولة 8" },
        {
          day: "الجمعة",
          date: "30/10",
          time: "09:00–13:00",
          activity: "🎭 أنشطة أخرى",
        },
        { day: "", date: "", time: "14:30", activity: "⚡ BLITZ 11 جولة" },
        { day: "السبت", date: "31/10", time: "09:30", activity: "♟ الجولة 9" },
        { day: "", date: "", time: "17:00", activity: "🏆 حفل توزيع الجوائز" },
        {
          day: "الأحد",
          date: "01/11",
          time: "قبل 12:00",
          activity: "✈ المغادرة",
        },
      ],
    },
    prizes: {
      index: "04",
      title: "قائمة الجوائز",
      emphasis: "MCF 2026",
      generalTitle: "🏆 الترتيب العام",
      generalHeaders: ["الرتبة", "Magistral", "Challenge", "Blitz"],
      generalRows: [
        ["1", "3 000 €", "500 €", "300 €"],
        ["2", "1 500 €", "300 €", "200 €"],
        ["3", "1 000 €", "200 €", "150 €"],
        ["4", "700 €", "150 €", "100 €"],
        ["5", "500 €", "120 €", "50 €"],
        ["6", "400 €", "100 €", "—"],
        ["7", "300 €", "100 €", "—"],
        ["8", "200 €", "100 €", "—"],
        ["9", "150 €", "100 €", "—"],
        ["10", "100 €", "100 €", "—"],
      ],
      specialTitle: "♀ جوائز السيدات والخاصة",
      specialHeaders: ["الفئة", "Magistral", "Challenge"],
      specialRows: [
        ["السيدات 1", "700 €", "300 €"],
        ["السيدات 2", "600 €", "200 €"],
        ["السيدات 3", "500 €", "100 €"],
        ["شبان / كبار / قدماء", "جوائز مخصصة", "جوائز مخصصة"],
      ],
      envelopeTitle: "الغلاف الجملي",
      envelopeText:
        "توزيع صُمم لتثمين المستوى الرياضي وتشجيع مشاركة السيدات ودعم عدة فئات خاصة.",
    },
    accommodation: {
      index: "05",
      title: "الباقة الشاملة",
      emphasis: "9 ليالٍ إقامة كاملة",
      includesTitle: "ما الذي تتضمنه الباقة الشاملة",
      includes: [
        "إقامة 9 ليالٍ مع وجبات كاملة",
        "تحويلات المطار – ياسمين الحمامات ذهابًا وإيابًا",
        "حقوق المشاركة في دورتي Magistral أو Challenge",
        "التكفل بمعلوم رخصة FTE (15 €)",
        "تخفيض 15% على باقات السبا والحمام",
        "تذكرة قرطاج لاند + بطاقة الترفيه مشمولة",
        "تخفيض 20% على التذكرة الثانية أو الباقة العائلية",
        "تخفيض 50% على الرحلات السياحية",
        "رحلة سياحية مجانية واحدة",
        "النفاذ إلى الماستر كلاس وبقية أنشطة المهرجان",
      ],
      perPerson: "/للشخص",
      hotels: [
        {
          name: "Diar Lemdina Suites Hotel",
          highlight: "داخل الموقع · مكان البطولة",
          price: "690 €",
          copy: "في قلب Medina Mediterranea يوفر هذا الفندق إقامة راقية في أكثر من 250 جناحًا وغرفة موزعة على ثلاث إقامات فخمة.",
          bullets: [
            "جناح Senior: غرفة مزدوجة + صالون",
            "جناح Ambassador: غرفتان + حمامان + صالون",
          ],
        },
        {
          name: "Belisaire & Thalasso",
          highlight: "على بعد 700 م من المركب · مناسب للعائلات",
          price: "790 €",
          copy: "خيار متوازن للعائلات مع غرف واسعة ووصول سريع إلى موقع البطولة وشاطئ خاص ومركز للعلاج بمياه البحر.",
          bullets: [
            "غرف ملائمة لذوي الاحتياجات الخاصة",
            "شاطئ خاص على بعد 200 متر",
            "حدائق واسعة ومركز تالاسو",
          ],
        },
        {
          name: "Solaria & Thalasso",
          highlight: "5 نجوم · فخامة",
          price: "990 €",
          copy: "أرقى إقامة في المهرجان للاعبين والمرافقين الباحثين عن تجربة 5 نجوم وخدمة فندقية متميزة.",
          bullets: [
            "غرف ديلوكس بإطلالة على البحر",
            "نفاذ مميز إلى السبا والتالاسو",
            "خدمات فندقية فاخرة",
          ],
        },
      ],
    },
    regulation: {
      index: "06",
      title: "النظام الداخلي",
      emphasis: "MCF 2026",
      blocks: [
        {
          title: "الفصل 1 — التنظيم",
          items: [
            "مهرجان دولي للشطرنج من 23 أكتوبر إلى 1 نوفمبر 2026 بقاعة Hannibal داخل Medina Conference & Expo Center.",
            "دورتان كلاسيكيتان معتمدتان من FIDE: Magistral وChallenge في 9 جولات.",
            "يعتمد آخر تصنيف Elo FIDE منشور بتاريخ 01/10/2026.",
            "سيتم نقل أول 20 رقعة مباشرة عبر DGT.",
          ],
        },
        {
          title: "الفصل 2 — القوانين والاقترانات",
          items: [
            "يطبق قانون FIDE المعمول به مع نظام الاقتران السويسري.",
            "تصبح الاقترانات نهائية بعد ساعتين من نهاية الجولة السابقة إلا في حالات القوة القاهرة.",
            "التثبيت على عين المكان قبل 14:30 شرط للاقتران في الجولة الأولى.",
            "النتائج والاقترانات تنشر على chess-results.com.",
          ],
        },
        {
          title: "الفصل 3 — وتيرة اللعب",
          items: [
            "الدورات الكلاسيكية: 90 دقيقة + 30 ثانية/نقلة.",
            "البلتز: 3 دقائق + 2 ثانية/نقلة.",
            "التوقيت الرسمي هو المعتمد في البرنامج المنشور.",
            "احترام الرزنامة ضروري لحسن سير المنافسة.",
          ],
        },
        {
          title: "الفصل 5 — الغياب و bye",
          items: [
            "أقصى تأخير قبل الخسارة بالغياب: 30 دقيقة بعد الانطلاق الفعلي للجولة.",
            "كل غياب دون إعلام قد يعتبر انسحابًا من الدورة.",
            "تسلّم أوراق المباريات الممضاة للحكم في نهاية كل جولة.",
          ],
        },
        {
          title: "الفصل 8 — مكافحة الغش والإلكترونيات",
          items: [
            "الهواتف والساعات الذكية والسماعات وأجهزة البلوتوث ممنوعة أثناء اللعب.",
            "كل مخالفة تؤدي إلى خسارة فورية للمباراة.",
            "توجد خدمة إيداع عند مدخل القاعة.",
          ],
        },
        {
          title: "الفصل 12 — الوسائط",
          items: [
            "يمكن نشر صور وفيديوهات المهرجان قبل الحدث وأثناءه وبعده.",
            "التسجيل يعني موافقة المشارك أو وليه القانوني على هذا النشر.",
            "التواصل البصري جزء أساسي من تثمين المهرجان.",
          ],
        },
      ],
    },
    sponsors: {
      index: "07",
      title: "رعاتنا",
      emphasis: "والشركاء",
      items: [
        { icon: "🏰", name: "Diar Lemdina", type: "فندق شريك" },
        { icon: "🏖", name: "Belisaire & Thalasso", type: "فندق شريك" },
        { icon: "⭐", name: "Solaria & Thalasso", type: "فندق شريك" },
        { icon: "🎡", name: "Carthage Land Hammamet", type: "شريك ترفيه" },
        { icon: "🎪", name: "Carthage Land Tunis", type: "شريك ترفيه" },
        { icon: "➕", name: "Sponsor 6", type: "سيتم التأكيد لاحقًا" },
      ],
    },
    gallery: {
      index: "08",
      title: "ياسمين الحمامات",
      emphasis: "والمدينة",
      badge: "المعرض",
      items: [
        { image: hannibalImage, title: "قاعة اللعب Hannibal", large: true },
        { image: medinaImage, title: "المدينة" },
        { image: beachImage, title: "شاطئ ياسمين" },
        { image: soukImage, title: "الأسواق" },
        {
          gradient: "from-[#1a2a3a] to-[#2d4f6a]",
          title: "المارينا",
          icon: "⛵",
          medium: true,
        },
        {
          gradient: "from-[#2a1a3a] to-[#5a2d8a]",
          title: "Carthage Land",
          icon: "🎡",
        },
      ],
    },
    contact: {
      index: "09",
      title: "التحق بـ",
      emphasis: "MCF 2026",
      infoTitle: "معلومات",
      infoLines: [
        "📍 المكان: Medina Conference & Expo Center، قاعة «Hannibal»، ياسمين الحمامات، تونس",
        "📅 التواريخ: 23 أكتوبر – 1 نوفمبر 2026",
        "🌐 الموقع: medinachessfestival.com",
        "🏆 الاعتماد: FIDE · الجامعة التونسية للشطرنج",
        "👨‍⚖️ الحكم الرئيسي: IA Slim Hammami",
      ],
      deadlineTitle: "آخر أجل للتسجيل",
      deadlineText:
        "إلى غاية 15 سبتمبر 2026. بعد ذلك يمكن تطبيق زيادة من 10 إلى 15% حسب الصيغة المختارة.",
      countdownLabels: ["أيام", "ساعات", "دق", "ث"],
    },
  },
};

export default function LandingPage() {
  const { language, dictionary } = useLanguage();
  const countdown = useFestivalCountdown("2026-09-15T23:59:59");
  const content = landingContent[language] || landingContent.fr;
  const prizeData = prizeContentMap[language] || prizeContentMap.fr;

  return (
    <div className="min-h-screen bg-[#f6efe5] text-[#1b1712]">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-[#111111] text-[#f5efe6]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(201,162,39,0.12),transparent_20%)]" />
          <div className="container relative grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div className="inline-flex rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#e7c86f]">
                {dictionary.heroBadge}
              </div>

              <div className="space-y-5">
                <p className="font-display text-lg tracking-[0.4em] text-[#c9a227]">
                  {content.hero.eyebrow}
                </p>
                <h1 className="font-display text-5xl font-black uppercase leading-[0.92] sm:text-6xl lg:text-7xl">
                  {content.hero.titleLines[0]} <br />{" "}
                  {content.hero.titleLines[1]}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[#e7dcc9]">
                  {content.hero.intro}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#c9a227] px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-[#111111] transition hover:-translate-y-0.5 hover:bg-[#d7b966]"
                >
                  {dictionary.registerNow}
                </a>
                <a
                  href="#tournois"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:border-[#c9a227] hover:text-[#e7c86f]"
                >
                  {dictionary.discover}
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {content.stats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#e7c86f]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="font-display text-3xl text-[#f9e8ae]">
                        {item.value}
                      </div>
                      <div className="mt-2 text-sm uppercase tracking-[0.18em] text-[#cec1ad]">
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[40px] bg-[#c9a227]/12 blur-3xl" />
              <div className="relative overflow-hidden rounded-[36px] border border-[#c9a227]/20 bg-[linear-gradient(160deg,rgba(35,28,18,0.96),rgba(15,15,15,0.92))] p-6 shadow-[0_35px_100px_rgba(0,0,0,0.45)] sm:p-8">
                <div className="grid gap-6">
                  <div className="rounded-[30px] border border-[#c9a227]/20 bg-[#c9a227]/6 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-[#c9a227]">
                          {content.hero.venueLabel}
                        </p>
                        <h2 className="mt-3 font-display text-3xl text-white">
                          {content.hero.venueTitle}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-[#ddd2c0]">
                          {content.hero.venueText}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/10 p-3 text-[#e7c86f]">
                        <MapPin className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#c9a227]">
                        {content.hero.arrivalLabel}
                      </p>
                      <div className="mt-2 font-display text-4xl text-white">
                        {content.hero.arrivalDate}
                      </div>
                      <p className="mt-1 text-sm text-[#cec1ad]">
                        {content.hero.arrivalText}
                      </p>
                    </div>
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#c9a227]">
                        {content.hero.departureLabel}
                      </p>
                      <div className="mt-2 font-display text-4xl text-white">
                        {content.hero.departureDate}
                      </div>
                      <p className="mt-1 text-sm text-[#cec1ad]">
                        {content.hero.departureText}
                      </p>
                    </div>
                  </div>

                  <ChessBoardPreview />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Section
          id="festival"
          index={content.festival.index}
          title={content.festival.title}
          emphasis={content.festival.emphasis}
        >
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="space-y-6"
            >
              <p className="text-lg leading-9 text-[#4f463a]">
                {content.festival.lead1}
              </p>
              <p className="text-base leading-8 text-[#5d5448]">
                {content.festival.lead2}
              </p>
              <div className="rounded-[32px] border border-[#d9cdb7] bg-white/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                <h3 className="font-display text-2xl text-[#1d1712]">
                  {content.festival.boxTitle}
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#5d5448]">
                  {content.festival.boxLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ delay: 0.1 }}
              className="grid gap-5"
            >
              <div className="overflow-hidden rounded-[34px] border border-[#d8c8a8] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                <img
                  src={medinaImage}
                  alt={content.gallery.items[1].title}
                  className="h-72 w-full object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[#a07c24]">
                    <Star className="h-5 w-5" />{" "}
                    {content.festival.imageCardLabel}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#5d5448]">
                    {content.festival.imageCardText}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.festival.miniCards.map((card) => (
                  <InfoMiniCard
                    key={card.title}
                    icon={card.icon}
                    title={card.title}
                    text={card.text}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </Section>

        <Section
          id="tournois"
          index={content.tournaments.index}
          title={content.tournaments.title}
          emphasis={content.tournaments.emphasis}
          dark
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {content.tournaments.cards.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.18 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-sm"
                >
                  <div
                    className={`inline-flex rounded-2xl bg-gradient-to-br ${item.tone} p-3 text-[#111111]`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-3xl text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 inline-flex rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#e7c86f]">
                        {item.badge}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm leading-7 text-[#ddd2c0]">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex gap-3">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#d8b459]" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-white/10 pt-5 font-display text-2xl text-[#f8e7aa]">
                    {item.prize}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </Section>

        <Section
          id="programme"
          index={content.schedule.index}
          title={content.schedule.title}
          emphasis={content.schedule.emphasis}
        >
          <div className="overflow-hidden rounded-[34px] border border-[#d8ccb5] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#14110f] text-[#f4ece1]">
                  <tr className="text-sm uppercase tracking-[0.16em]">
                    {content.schedule.headers.map((header) => (
                      <th key={header} className="px-6 py-4">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.schedule.rows.map((row, index) => (
                    <tr
                      key={`${row.time}-${index}`}
                      className="border-b border-[#efe4d3] text-sm text-[#4f463a] odd:bg-[#fcfaf6]"
                    >
                      <td className="px-6 py-4 font-semibold text-[#1f1812]">
                        {row.day || "—"}
                      </td>
                      <td className="px-6 py-4">{row.date || "—"}</td>
                      <td className="px-6 py-4">{row.time}</td>
                      <td className="px-6 py-4">{row.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        <Section
          id="prix"
          index={content.prizes.index}
          title={content.prizes.title}
          emphasis={content.prizes.emphasis}
          accent
        >
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <PrizeTableCard
              title={prizeData.generalTitle}
              headers={prizeData.generalHeaders}
              rows={prizeData.generalRows}
            />
            <div className="grid gap-6">
              <PrizeTableCard
                title={prizeData.specialTitle}
                headers={prizeData.specialHeaders}
                rows={prizeData.specialRows}
                compact
              />
              <div className="rounded-[32px] border border-[#d4bf7a] bg-[#111111] p-6 text-[#f4ece1] shadow-[0_25px_80px_rgba(0,0,0,0.16)]">
                <div className="flex items-center gap-3 text-[#f0d37b]">
                  <Trophy className="h-5 w-5" />
                  {prizeData.grandTotalLabel}
                </div>
                <div className="mt-3 font-display text-5xl text-white">
                  {prizeData.grandTotal}
                </div>
                <p className="mt-4 text-sm leading-7 text-[#ddd2c0]">
                  {prizeData.sponsorNote}
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="hebergement"
          index={content.accommodation.index}
          title={content.accommodation.title}
          emphasis={content.accommodation.emphasis}
          dark
        >
          <div className="rounded-[34px] border border-[#c9a227]/18 bg-white/[0.03] p-8">
            <h3 className="text-center font-display text-2xl text-[#f8e7aa]">
              {content.accommodation.includesTitle}
            </h3>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {content.accommodation.includes.map((item, index) => (
                <motion.div
                  key={item}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-[26px] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-[#e9ddc8]"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {content.accommodation.hotels.map((hotel, index) => (
              <motion.article
                key={hotel.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                transition={{ delay: index * 0.08 }}
                className="flex h-full flex-col rounded-[32px] border border-white/10 bg-[#16120f] p-6 text-[#f4ece1] shadow-[0_25px_80px_rgba(0,0,0,0.22)]"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-[#c9a227]">
                  ★★★★
                </p>
                <h3 className="mt-4 font-display text-3xl text-white">
                  {hotel.name}
                </h3>
                <p className="mt-3 text-sm uppercase tracking-[0.16em] text-[#e6cb76]">
                  {hotel.highlight}
                </p>
                <p className="mt-5 text-sm leading-7 text-[#ddd2c0]">
                  {hotel.copy}
                </p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-[#cec1ad]">
                  {hotel.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#d8b459]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 font-display text-4xl text-[#f8e7aa]">
                  {hotel.price}
                  <span className="ml-2 text-sm font-sans uppercase tracking-[0.18em] text-[#cec1ad]">
                    {content.accommodation.perPerson}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section
          id="reglement"
          index={content.regulation.index}
          title={content.regulation.title}
          emphasis={content.regulation.emphasis}
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {content.regulation.blocks.map((block, index) => (
              <motion.article
                key={block.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.14 }}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
                className="rounded-[32px] border border-[#d8ccb5] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
              >
                <h3 className="border-b border-[#d8b459]/45 pb-3 font-display text-2xl text-[#1f1812]">
                  {block.title}
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-[#5d5448]">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <ScrollText className="mt-1 h-4 w-4 shrink-0 text-[#b0862d]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/docs/reglement-interieur-mcf-2026.docx"
              download
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#111111] px-5 py-3 text-sm font-semibold text-[#f2d77e] transition hover:bg-[#c9a227] hover:text-[#111111]"
            >
              <Download className="h-4 w-4" />
              {dictionary.downloadMainRules ||
                "Télécharger le règlement général"}
            </a>
            <a
              href="/docs/reglement-interieur-blitz-mcf-2026.docx"
              download
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#111111] px-5 py-3 text-sm font-semibold text-[#f2d77e] transition hover:bg-[#c9a227] hover:text-[#111111]"
            >
              <Download className="h-4 w-4" />
              {dictionary.downloadBlitzRules ||
                "Télécharger le règlement Blitz"}
            </a>
          </div>
        </Section>

        <Section
          id="sponsors"
          index={content.sponsors.index}
          title={content.sponsors.title}
          emphasis={content.sponsors.emphasis}
          dark
        >
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {content.sponsors.items.map((item, index) => (
              <motion.div
                key={item.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.16 }}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
                className="rounded-[30px] border border-white/10 bg-white/5 p-6 text-center text-[#f4ece1] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
              >
                <div className="text-5xl">{item.icon}</div>
                <h3 className="mt-4 font-display text-2xl text-white">
                  {item.name}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[#e6cb76]">
                  {item.type}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section
          id="galerie"
          index={content.gallery.index}
          title={content.gallery.title}
          emphasis={content.gallery.emphasis}
          dark
        >
          <div className="grid auto-rows-[220px] gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.gallery.items.map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.16 }}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
                className={[
                  "group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111111]",
                  item.large ? "xl:col-span-2 xl:row-span-2 xl:h-auto" : "",
                  item.medium ? "md:col-span-2 xl:col-span-2" : "",
                ].join(" ")}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${item.gradient} text-white`}
                  >
                    <div className="text-6xl">{item.icon}</div>
                  </div>
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
                  <div>
                    <div className="flex items-center gap-2 text-[#e6cb76]">
                      <Camera className="h-4 w-4" /> {content.gallery.badge}
                    </div>
                    <p className="mt-2 font-display text-2xl text-white">
                      {item.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-5 py-3 text-sm font-semibold text-[#f2d77e] transition hover:bg-[#c9a227] hover:text-[#111111]"
            >
              {dictionary.seeMoreGallery || "Voir plus"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Section>

        <Section
          id="contact"
          index={content.contact.index}
          title={content.contact.title}
          emphasis={content.contact.emphasis}
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <RegistrationForm />
            </div>
            <div className="space-y-6">
              <InfoPanel title={content.contact.infoTitle} icon={MapPin}>
                {content.contact.infoLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </InfoPanel>

              <InfoPanel
                title={content.contact.deadlineTitle}
                icon={TimerReset}
                dark
              >
                <p className="text-sm leading-7 text-[#ddd2c0]">
                  {content.contact.deadlineText}
                </p>
                <div className="mt-5 grid grid-cols-4 gap-3">
                  {[
                    countdown.days,
                    countdown.hours,
                    countdown.minutes,
                    countdown.seconds,
                  ].map((value, index) => (
                    <div
                      key={`${content.contact.countdownLabels[index]}-${value}`}
                      className="rounded-[20px] border border-[#c9a227]/18 bg-[#c9a227]/8 px-3 py-4 text-center"
                    >
                      <div className="font-display text-3xl text-[#f8e7aa]">
                        {value}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#cec1ad]">
                        {content.contact.countdownLabels[index]}
                      </div>
                    </div>
                  ))}
                </div>
              </InfoPanel>

              <div className="overflow-hidden rounded-[34px] border border-[#d8ccb5] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                <img
                  src={beachImage}
                  alt={content.gallery.items[2].title}
                  className="h-64 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

function Section({
  id,
  index,
  title,
  emphasis,
  children,
  dark = false,
  accent = false,
}) {
  const tone = dark
    ? "bg-[#111111] text-[#f4ece1]"
    : accent
      ? "bg-[linear-gradient(180deg,#f5efe5_0%,#efe0b7_100%)] text-[#1b1712]"
      : "bg-[#f6efe5] text-[#1b1712]";

  return (
    <section id={id} className={tone}>
      <div className="container py-20 sm:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div
            className={`text-xs font-semibold uppercase tracking-[0.32em] ${dark ? "text-[#e6cb76]" : "text-[#a07c24]"}`}
          >
            {index} — {title}
          </div>
          <h2
            className={`mt-5 font-display text-4xl leading-tight sm:text-5xl ${dark ? "text-white" : "text-[#1f1812]"}`}
          >
            {title} <br />
            <em
              className={`not-italic ${dark ? "text-[#f4e2a6]" : "text-[#8e6717]"}`}
            >
              {emphasis}
            </em>
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function InfoMiniCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[28px] border border-[#d8ccb5] bg-white p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a227]/10 text-[#a07c24]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-2xl text-[#1f1812]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#5d5448]">{text}</p>
    </div>
  );
}

function PrizeTableCard({ title, headers, rows, compact = false }) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-[#d8ccb5] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
      <div className="border-b border-[#eadcc4] px-6 py-5">
        <h3 className="font-display text-2xl text-[#1f1812]">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-[#fbf6ee] text-[#5d5448]">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 font-semibold uppercase tracking-[0.14em]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row[0]}-${index}`}
                className="border-b border-[#efe4d3] text-[#433b30] odd:bg-[#fffdf9]"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${row[0]}-${cellIndex}`}
                    className={compact ? "px-6 py-4" : "px-6 py-5"}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoPanel({ title, icon: Icon, children, dark = false }) {
  return (
    <div
      className={[
        "rounded-[32px] border p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]",
        dark
          ? "border-[#c9a227]/22 bg-[#111111] text-[#f4ece1]"
          : "border-[#d8ccb5] bg-white text-[#1f1812]",
      ].join(" ")}
    >
      <div
        className={`flex items-center gap-3 ${dark ? "text-[#f0d37b]" : "text-[#a07c24]"}`}
      >
        <Icon className="h-5 w-5" />
        <h3 className="font-display text-2xl">{title}</h3>
      </div>
      <div
        className={`mt-4 space-y-2 text-sm leading-7 ${dark ? "text-[#ddd2c0]" : "text-[#5d5448]"}`}
      >
        {children}
      </div>
    </div>
  );
}

function ChessBoardPreview() {
  const cells = useMemo(() => {
    const pieces = ["♔", "♕", "♖", "♗", "♘", "♙", "", "", ""];
    return Array.from({ length: 64 }, (_, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      const darkSquare = (row + col) % 2 === 1;
      const seed = (index * 7 + row * 3 + col) % pieces.length;
      const piece = row < 2 && index % 3 !== 0 ? pieces[seed] : "";
      return { index, darkSquare, piece };
    });
  }, []);

  return (
    <div className="rounded-[30px] border border-white/10 bg-black/25 p-4">
      <div className="grid grid-cols-8 overflow-hidden rounded-[24px] border border-[#c9a227]/15">
        {cells.map((cell) => (
          <div
            key={cell.index}
            className={[
              "flex aspect-square items-center justify-center text-2xl sm:text-3xl",
              cell.darkSquare
                ? "bg-[#171717] text-[#f5efe6]/80"
                : "bg-[#c9a227]/25 text-[#111111]/80",
            ].join(" ")}
          >
            {cell.piece}
          </div>
        ))}
      </div>
    </div>
  );
}

function useFestivalCountdown(targetDate) {
  const compute = () => {
    const diff = Math.max(new Date(targetDate).getTime() - Date.now(), 0);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return {
      days: String(days).padStart(3, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const [value, setValue] = useState(compute);

  useEffect(() => {
    const timer = window.setInterval(() => setValue(compute()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return value;
}
