import { ArrowLeft, CalendarDays, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RegistrationForm from "../../components/RegistrationForm";
import { useLanguage } from "../../contexts/LanguageContext";

export default function RegistrationPage() {
  const { dictionary } = useLanguage();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0f1720_0%,#151a23_28%,#f6efe5_28%,#f4ecdf_100%)] text-[#1f1812]">
      <Header />
      <main>
        <section className="pb-12 pt-10 sm:pb-16 sm:pt-14">
          <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-6 rounded-[34px] border border-white/10 bg-[#111111]/92 p-6 text-white shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-8">
              <div className="inline-flex rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#f1d57b]">
                {dictionary.formBadge || "Formulaire d’inscription"}
              </div>

              <div>
                <h1 className="font-display text-4xl text-white sm:text-5xl">
                  {dictionary.formHeading || "Inscription"}
                </h1>
                <p className="mt-4 text-sm leading-7 text-[#ddd2c0] sm:text-base">
                  {dictionary.formDescription || "Complétez le formulaire sécurisé, joignez les documents demandés et validez l’anti-bot avant l’envoi."}
                </p>
              </div>

              <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-5">
                {[
                  dictionary.personalPassportRequired || "Passeport du joueur obligatoire.",
                  dictionary.companionValidationError || "Chaque accompagnant doit avoir un nom complet et un passeport.",
                  dictionary.emailInvalid || "L’adresse email doit être valide.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-7 text-[#efe6d8]">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#e6cb76]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#f1d57b]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#e6cb76]">
                    Cloudflare Turnstile
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#ddd2c0]">
                    Vérification anti-bot avant l’envoi du dossier.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#f1d57b]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#e6cb76]">
                    Documents
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#ddd2c0]">
                    PDF, JPG, PNG ou WEBP · 8 Mo maximum par fichier.
                  </p>
                </div>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#c9a227]/35 hover:text-[#f1d57b]"
              >
                <ArrowLeft className="h-4 w-4" />
                {dictionary.backToHome || "Retour à l’accueil"}
              </Link>
            </div>

            <RegistrationForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
