import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  Send,
  ShieldAlert,
  Trash2,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage } from "../contexts/LanguageContext";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

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
  has_companion: false,
};

function createEmptyCompanion() {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    full_name: "",
    passportFile: null,
  };
}

const statusStyles = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  error: "border-red-500/20 bg-red-500/10 text-red-700",
  warning: "border-amber-500/25 bg-amber-500/12 text-amber-700",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

function normalizeFile(file) {
  if (!file) return null;

  const normalizedType = file.type || "application/octet-stream";

  return {
    file,
    type: normalizedType,
  };
}

export default function RegistrationForm() {
  const { dictionary } = useLanguage();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [personalPassport, setPersonalPassport] = useState(null);
  const [companions, setCompanions] = useState([createEmptyCompanion()]);
  const [fileResetKey, setFileResetKey] = useState(0);

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

  function resetUploads() {
    setPersonalPassport(null);
    setCompanions([createEmptyCompanion()]);
    setFileResetKey((previous) => previous + 1);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "has_companion" && !checked) {
      setCompanions([createEmptyCompanion()]);
    }
  }

  function handlePersonalPassportChange(event) {
    setPersonalPassport(normalizeFile(event.target.files?.[0] || null));
  }

  function handleCompanionValueChange(id, value) {
    setCompanions((previous) =>
      previous.map((companion) =>
        companion.id === id ? { ...companion, full_name: value } : companion,
      ),
    );
  }

  function handleCompanionPassportChange(id, event) {
    const nextFile = normalizeFile(event.target.files?.[0] || null);

    setCompanions((previous) =>
      previous.map((companion) =>
        companion.id === id ? { ...companion, passportFile: nextFile } : companion,
      ),
    );
  }

  function addCompanion() {
    setCompanions((previous) => [...previous, createEmptyCompanion()]);
  }

  function removeCompanion(id) {
    setCompanions((previous) => {
      const filtered = previous.filter((companion) => companion.id !== id);
      return filtered.length ? filtered : [createEmptyCompanion()];
    });
  }

  function getFileValidationMessage(fileWrapper) {
    if (!fileWrapper?.file) {
      return dictionary.personalPassportRequired || "Veuillez joindre le passeport demandé.";
    }

    if (!ALLOWED_FILE_TYPES.includes(fileWrapper.type)) {
      return dictionary.invalidFileType || "Format de fichier non autorisé.";
    }

    if (fileWrapper.file.size > MAX_FILE_SIZE) {
      return dictionary.fileTooLarge || "Chaque fichier doit faire 8 Mo maximum.";
    }

    return "";
  }

  async function buildSerializableFile(fileWrapper) {
    const dataUrl = await fileToDataUrl(fileWrapper.file);

    return {
      name: fileWrapper.file.name,
      type: fileWrapper.type,
      size: fileWrapper.file.size,
      dataUrl,
    };
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

    if (!form.has_companion) {
      const errorMessage = getFileValidationMessage(personalPassport);
      if (errorMessage) {
        setStatus({ type: "error", message: errorMessage });
        return;
      }
    }

    let sanitizedCompanions = [];

    if (form.has_companion) {
      sanitizedCompanions = companions.filter(
        (companion) => companion.full_name.trim() || companion.passportFile?.file,
      );

      if (!sanitizedCompanions.length) {
        setStatus({
          type: "error",
          message:
            dictionary.companionValidationError ||
            "Veuillez renseigner le nom et le passeport de chaque accompagnant.",
        });
        return;
      }

      for (const companion of sanitizedCompanions) {
        if (!companion.full_name.trim()) {
          setStatus({
            type: "error",
            message:
              dictionary.companionValidationError ||
              "Veuillez renseigner le nom et le passeport de chaque accompagnant.",
          });
          return;
        }

        const companionError = getFileValidationMessage(companion.passportFile);
        if (companionError) {
          setStatus({
            type: "error",
            message:
              dictionary.companionValidationError ||
              companionError,
          });
          return;
        }
      }
    }

    setLoading(true);

    try {
      const personalPassportPayload =
        form.has_companion || !personalPassport
          ? null
          : await buildSerializableFile(personalPassport);

      const companionsPayload = await Promise.all(
        sanitizedCompanions.map(async (companion) => ({
          full_name: companion.full_name.trim().slice(0, 140),
          passport: await buildSerializableFile(companion.passportFile),
        })),
      );

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
        has_companion: form.has_companion,
        personal_passport: personalPassportPayload,
        companions: companionsPayload,
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
      resetUploads();
      setLoading(false);

      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      }
    } catch {
      setStatus({
        type: "error",
        message:
          dictionary.formServerError ||
          "Une erreur est survenue lors de l’enregistrement.",
      });
      setLoading(false);
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
          {dictionary.passportUploadNotice ||
            "Si vous êtes seul, veuillez joindre votre passeport. Si vous venez avec des accompagnants, ajoutez leurs noms et leurs passeports."}
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
              name="has_companion"
              checked={form.has_companion}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-[#cab98d] bg-white text-[#c9a227] focus:ring-[#c9a227]"
            />
            <span>{dictionary.withCompanion || "Je viens avec un ou plusieurs accompagnants"}</span>
          </label>

          {!form.has_companion ? (
            <DocumentCard
              key={`personal-${fileResetKey}`}
              title={dictionary.personalPassport || "Passeport du participant"}
              subtitle={dictionary.fileUploadHelp || "Formats acceptés : PDF, JPG, PNG ou WEBP · 8 Mo max par fichier."}
            >
              <input
                key={`personal-input-${fileResetKey}`}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                onChange={handlePersonalPassportChange}
                className="block w-full rounded-2xl border border-dashed border-[#d8ccb5] bg-white px-4 py-4 text-sm text-[#5d5448] file:mr-4 file:rounded-full file:border-0 file:bg-[#c9a227] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#111111]"
              />
              {personalPassport?.file ? (
                <p className="mt-3 text-sm text-[#4f463b]">
                  <Upload className="mr-2 inline h-4 w-4" />
                  {personalPassport.file.name}
                </p>
              ) : null}
            </DocumentCard>
          ) : (
            <DocumentCard
              title={dictionary.companionsTitle || "Accompagnants"}
              subtitle={dictionary.fileUploadHelp || "Formats acceptés : PDF, JPG, PNG ou WEBP · 8 Mo max par fichier."}
            >
              <div className="space-y-4">
                {companions.map((companion, index) => (
                  <div
                    key={companion.id}
                    className="rounded-[24px] border border-[#eadcc4] bg-white p-4"
                  >
                    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                      <Field label={`${dictionary.companionName || "Nom complet de l’accompagnant"} ${index + 1}`}>
                        <Input
                          value={companion.full_name}
                          onChange={(event) =>
                            handleCompanionValueChange(companion.id, event.target.value)
                          }
                          maxLength={140}
                          className="border-[#e7dbc7] bg-[#fcfaf6] text-[#1b1712] placeholder:text-[#9e927f] focus-visible:ring-[#c9a227]"
                        />
                      </Field>

                      <Field label={dictionary.companionPassport || "Passeport de l’accompagnant"}>
                        <input
                          key={`companion-file-${companion.id}-${fileResetKey}`}
                          type="file"
                          accept=".pdf,image/jpeg,image/png,image/webp"
                          onChange={(event) =>
                            handleCompanionPassportChange(companion.id, event)
                          }
                          className="block w-full rounded-2xl border border-dashed border-[#d8ccb5] bg-[#fcfaf6] px-4 py-3 text-sm text-[#5d5448] file:mr-4 file:rounded-full file:border-0 file:bg-[#c9a227] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#111111]"
                        />
                      </Field>

                      <button
                        type="button"
                        onClick={() => removeCompanion(companion.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8ccb5] px-4 py-3 text-sm font-semibold text-[#6a5d4d] transition hover:border-[#c9a227] hover:text-[#1b1712]"
                      >
                        <Trash2 className="h-4 w-4" />
                        {dictionary.removeCompanion || "Retirer"}
                      </button>
                    </div>

                    {companion.passportFile?.file ? (
                      <p className="mt-3 text-sm text-[#4f463b]">
                        <Upload className="mr-2 inline h-4 w-4" />
                        {companion.passportFile.file.name}
                      </p>
                    ) : null}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCompanion}
                  className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-5 py-3 text-sm font-semibold text-[#946f1c] transition hover:bg-[#c9a227] hover:text-[#111111]"
                >
                  <Plus className="h-4 w-4" />
                  {dictionary.addCompanion || "Ajouter un accompagnant"}
                </button>
              </div>
            </DocumentCard>
          )}

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

function DocumentCard({ title, subtitle, children }) {
  return (
    <div className="rounded-[28px] border border-[#eadcc4] bg-[#fcfaf6] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#4c4338]">
          {title}
        </p>
        <p className="mt-1 text-xs leading-6 text-[#7b6d5c]">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
