import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Send, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  telephone: "",
  country: "",
  birth_date: "",
  elo: "",
  fide_id: "",
  tournament: "challenge",
  hotel: "",
  message: "",
  accept_rules: false,
  website: "",
};

const statusStyles = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  error: "border-red-500/20 bg-red-500/10 text-red-700",
  warning: "border-amber-500/25 bg-amber-500/12 text-amber-700",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationForm() {
  const { dictionary } = useLanguage();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaLoaded, setCaptchaLoaded] = useState(false);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const tournamentOptions = useMemo(
    () => [
      { value: "magistral", label: dictionary.tournamentMagistral },
      { value: "challenge", label: dictionary.tournamentChallenge },
      { value: "blitz", label: dictionary.tournamentBlitz },
    ],
    [dictionary],
  );

  const hotelOptions = useMemo(
    () => [
      { value: "", label: dictionary.chooseHotel },
      { value: "diar_lemdina", label: "Diar Lemdina" },
      { value: "belisaire", label: "Bélisaire & Thalasso" },
      { value: "solaria", label: "Solaria & Thalasso" },
      { value: "sans", label: dictionary.noHotel },
    ],
    [dictionary],
  );

  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return;

    let intervalId;

    const mountWidget = () => {
      if (!window.turnstile || !turnstileRef.current) return;
      if (widgetIdRef.current !== null) return;

      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        theme: "light",
        size: "flexible",
        callback: (token) => {
          setTurnstileToken(token);
        },
        "expired-callback": () => {
          setTurnstileToken("");
        },
        "error-callback": () => {
          setTurnstileToken("");
        },
      });

      setCaptchaLoaded(true);
    };

    if (window.turnstile) {
      mountWidget();
    } else {
      intervalId = setInterval(() => {
        if (window.turnstile) {
          clearInterval(intervalId);
          mountWidget();
        }
      }, 250);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);

      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!turnstileToken) {
      setStatus({
        type: "error",
        message:
          dictionary.captchaRequired ||
          "Veuillez valider le CAPTCHA avant d’envoyer le formulaire.",
      });
      return;
    }

    const trimmedEmail = form.email.trim().toLowerCase();

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !trimmedEmail ||
      !form.country.trim() ||
      !form.accept_rules
    ) {
      setStatus({
        type: "error",
        message:
          dictionary.formValidationError ||
          "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setStatus({
        type: "error",
        message:
          dictionary.emailInvalid ||
          "Veuillez saisir une adresse email valide.",
      });
      return;
    }

    if (form.website && form.website.trim() !== "") {
      setStatus({
        type: "warning",
        message:
          dictionary.blockedSubmission ||
          "Soumission bloquée car elle ressemble à un envoi automatisé.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      first_name: form.first_name.trim().slice(0, 80),
      last_name: form.last_name.trim().slice(0, 80),
      full_name: `${form.first_name} ${form.last_name}`.trim().slice(0, 170),
      email: trimmedEmail,
      telephone: form.telephone.trim().slice(0, 40),
      country: form.country.trim().slice(0, 80),
      birth_date: form.birth_date || null,
      elo: form.elo.trim().slice(0, 20),
      fide_id: form.fide_id.trim().slice(0, 30),
      tournament: form.tournament,
      hotel: form.hotel || null,
      message: form.message.trim().slice(0, 1500),
      accept_rules: form.accept_rules,
      status: "nouvelle",
    };

    const { data, error } = await supabase.functions.invoke(
      "submit-registration",
      {
        body: {
          ...payload,
          turnstileToken,
        },
      },
    );

    if (error) {
      let details =
        dictionary.formServerError ||
        "Une erreur est survenue lors de l’enregistrement.";

      try {
        const text = await error.context.text();

        if (text) {
          try {
            const parsed = JSON.parse(text);
            details = parsed?.error || parsed?.message || text;
          } catch {
            details = text;
          }
        }
      } catch {
        // keep fallback
      }

      setStatus({ type: "error", message: details });
      setLoading(false);

      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      }

      return;
    }

    setStatus({
      type: "success",
      message:
        data?.message ||
        dictionary.registrationSuccess ||
        "Inscription enregistrée avec succès. Nous vous contacterons prochainement.",
    });

    setForm(initialState);
    setLoading(false);

    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
      setTurnstileToken("");
    }
  }

  const statusIcon =
    status.type === "success" ? (
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
    ) : status.type === "warning" ? (
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
    ) : (
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
    );

  return (
    <div className="overflow-hidden rounded-[34px] border border-[#d8ccb5] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <div className="border-b border-[#eadcc4] bg-[linear-gradient(135deg,rgba(201,162,39,0.08),rgba(255,255,255,0.95))] p-6 sm:p-8">
        <div className="inline-flex rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#a07c24]">
          {dictionary.formBadge}
        </div>

        <h3 className="mt-5 font-display text-4xl text-[#1f1812]">
          {dictionary.formHeading}
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5d5448]">
          {dictionary.formDescription}
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            className="hidden"
            name="website"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field label={`${dictionary.firstName} *`}>
              <Input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                maxLength={80}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
              />
            </Field>

            <Field label={`${dictionary.lastName} *`}>
              <Input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                maxLength={80}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
              />
            </Field>

            <Field label={`${dictionary.email} *`}>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                maxLength={120}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
              />
            </Field>

            <Field label={dictionary.phone}>
              <Input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                maxLength={40}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
              />
            </Field>

            <Field label={`${dictionary.country} *`}>
              <Input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                maxLength={80}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
              />
            </Field>

            <Field label={dictionary.birthDate}>
              <Input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] focus-visible:ring-[#c9a227]"
              />
            </Field>

            <Field label={dictionary.elo}>
              <Input
                name="elo"
                value={form.elo}
                onChange={handleChange}
                maxLength={20}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
              />
            </Field>

            <Field label={dictionary.fideId}>
              <Input
                name="fide_id"
                value={form.fide_id}
                onChange={handleChange}
                maxLength={30}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
              />
            </Field>

            <Field label={`${dictionary.tournament} *`}>
              <Select
                name="tournament"
                value={form.tournament}
                onChange={handleChange}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] focus-visible:ring-[#c9a227]"
              >
                {tournamentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={dictionary.hotel}>
              <Select
                name="hotel"
                value={form.hotel}
                onChange={handleChange}
                className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] focus-visible:ring-[#c9a227]"
              >
                {hotelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={dictionary.message} className="md:col-span-2">
              <Textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={dictionary.messagePlaceholder}
                maxLength={1500}
                className="min-h-[150px] border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
              />
            </Field>
          </div>

          <label className="flex items-start gap-3 rounded-[24px] border border-[#eadcc4] bg-[#fcfaf6] p-4 text-sm leading-7 text-[#5d5448]">
            <Checkbox
              name="accept_rules"
              checked={form.accept_rules}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-[#cab98d] bg-white text-[#c9a227] focus:ring-[#c9a227]"
            />
            <span>{dictionary.acceptRules}</span>
          </label>

          <div className="space-y-5">
            <div className="rounded-[24px] border border-[#eadcc4] bg-[#fcfaf6] p-4 text-sm leading-7 text-[#776b5c]">
              {dictionary.storageNotePrefix}{" "}
              <code className="rounded bg-[#f1ead9] px-1.5 py-0.5 text-[#8e6717]">
                registrations
              </code>{" "}
              {dictionary.storageNoteSuffix}
            </div>

            <div className="rounded-[28px] border border-[#eadcc4] bg-[#fcfaf6] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <div className="mb-3">
                <p className="text-sm font-semibold text-[#5f5346]">
                  {dictionary.captchaTitle || "Vérification anti-bot"}
                </p>
                <p className="mt-1 text-xs leading-6 text-[#7b6d5c]">
                  {dictionary.captchaDescription ||
                    "Complétez cette vérification avant d’envoyer votre demande d’inscription."}
                </p>
              </div>

              {siteKey ? (
                <div className="min-h-[74px] overflow-x-auto">
                  <div
                    ref={turnstileRef}
                    className="mx-auto w-full max-w-[420px]"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  VITE_TURNSTILE_SITE_KEY is missing in your .env file.
                </div>
              )}

              {!captchaLoaded && siteKey ? (
                <p className="mt-3 text-xs text-[#9a8c78]">
                  {dictionary.captchaLoading || "Chargement du CAPTCHA..."}
                </p>
              ) : null}
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={loading || !turnstileToken}
                className="w-full gap-2 rounded-full bg-[#c9a227] px-7 text-[#111111] shadow-none hover:bg-[#d7b966] disabled:cursor-not-allowed disabled:opacity-60 md:min-w-[360px] md:w-auto"
              >
                <Send className="h-4 w-4" />
                {loading
                  ? dictionary.loading || "Envoi..."
                  : dictionary.submitRequest}
              </Button>
            </div>

            {status.message ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-3 rounded-[24px] border px-4 py-3 text-sm leading-7",
                  statusStyles[status.type] || statusStyles.error,
                )}
              >
                {statusIcon}
                <span>{status.message}</span>
              </motion.div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, className, children }) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#4c4338]">
        {label}
      </span>
      {children}
    </label>
  );
}
