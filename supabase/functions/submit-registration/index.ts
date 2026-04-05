import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const DOCUMENT_BUCKET = "registration-documents";
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function parseAllowedOrigins() {
  return (Deno.env.get("ALLOWED_ORIGINS") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string | null) {
  const allowedOrigins = parseAllowedOrigins();
  const allowedOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

function jsonResponse(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin),
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sanitizeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-");
}

function extractExtension(name: string, contentType: string) {
  const fileName = name || "document";
  const fileExtension = fileName.includes(".") ? fileName.split(".").pop() : "";

  if (fileExtension) return fileExtension.toLowerCase();

  if (contentType === "application/pdf") return "pdf";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

function parseUpload(file: any, required = true) {
  if (!file) {
    if (required) throw new Error("Missing required document");
    return null;
  }

  const type = String(file.type || "").trim();
  const size = Number(file.size || 0);
  const name = String(file.name || "document").trim();
  const dataUrl = String(file.dataUrl || "").trim();

  if (!type || !ALLOWED_FILE_TYPES.includes(type)) {
    throw new Error("Unsupported file type");
  }

  if (!size || size > MAX_FILE_SIZE) {
    throw new Error("Invalid file size");
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid file payload");
  }

  const [, mimeType, base64Data] = match;
  if (mimeType !== type) {
    throw new Error("File metadata mismatch");
  }

  const bytes = Uint8Array.from(atob(base64Data), (char) => char.charCodeAt(0));

  return {
    name,
    type,
    size,
    bytes,
    extension: extractExtension(name, type),
  };
}

async function uploadDocument(
  supabaseAdmin: ReturnType<typeof createClient>,
  registrationId: string,
  folder: string,
  file: ReturnType<typeof parseUpload>,
  sequence = 1,
) {
  if (!file) return null;

  const safeName = sanitizeFileName(file.name.replace(/\.[^.]+$/, "")) || `document-${sequence}`;
  const path = `${registrationId}/${folder}/${sequence}-${safeName}.${file.extension}`;

  const { error } = await supabaseAdmin.storage
    .from(DOCUMENT_BUCKET)
    .upload(path, file.bytes, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return path;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405, origin);
  }

  try {
    const body = await req.json().catch(() => null);

    const turnstileToken = body?.turnstileToken?.trim();
    const first_name = body?.first_name?.trim() || "";
    const last_name = body?.last_name?.trim() || "";
    const full_name = body?.full_name?.trim() || `${first_name} ${last_name}`.trim();
    const email = body?.email?.trim() || "";
    const telephone = body?.telephone?.trim() || "";
    const country = body?.country?.trim() || "";
    const birth_date = body?.birth_date || null;
    const elo = body?.elo?.trim() || "";
    const fide_id = body?.fide_id?.trim() || "";
    const tournament = body?.tournament?.trim() || "";
    const hotel = body?.hotel?.trim() || null;
    const message = body?.message?.trim() || "";
    const accept_rules = !!body?.accept_rules;
    const has_companion = !!body?.has_companion;
    const website = body?.website?.trim() || "";
    const personalPassportInput = body?.personal_passport || null;
    const companionsInput = Array.isArray(body?.companions) ? body.companions : [];

    if (website) {
      return jsonResponse({ success: false, error: "Bot detected" }, 400, origin);
    }

    if (!turnstileToken) {
      return jsonResponse({ success: false, error: "Missing CAPTCHA token" }, 400, origin);
    }

    if (!first_name || !last_name || !email || !country || !accept_rules) {
      return jsonResponse({ success: false, error: "Missing required fields" }, 400, origin);
    }

    let parsedPersonalPassport = null;
    try {
      parsedPersonalPassport = parseUpload(personalPassportInput, true);
    } catch (error) {
      return jsonResponse(
        { success: false, error: error instanceof Error ? error.message : "Invalid participant passport" },
        400,
        origin,
      );
    }

    const parsedCompanions = [];
    if (has_companion) {
      if (!companionsInput.length) {
        return jsonResponse({ success: false, error: "Missing companion documents" }, 400, origin);
      }

      for (const companion of companionsInput) {
        const companionName = String(companion?.full_name || "").trim();
        if (!companionName) {
          return jsonResponse({ success: false, error: "Missing companion name" }, 400, origin);
        }

        try {
          parsedCompanions.push({
            full_name: companionName.slice(0, 140),
            passport: parseUpload(companion?.passport, true),
          });
        } catch (error) {
          return jsonResponse(
            { success: false, error: error instanceof Error ? error.message : "Invalid companion passport" },
            400,
            origin,
          );
        }
      }
    }

    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (!turnstileSecret) {
      return jsonResponse({ success: false, error: "Missing TURNSTILE_SECRET_KEY" }, 500, origin);
    }

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: turnstileToken,
      }),
    });

    const verifyData = await verifyRes.json().catch(() => ({}));
    if (!verifyRes.ok || !verifyData.success) {
      return jsonResponse(
        {
          success: false,
          error: "CAPTCHA verification failed",
          details: verifyData["error-codes"] || [],
        },
        400,
        origin,
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const registrationId = crypto.randomUUID();
    const payload = {
      id: registrationId,
      first_name,
      last_name,
      full_name,
      email,
      telephone,
      country,
      birth_date,
      elo,
      fide_id,
      tournament,
      hotel,
      message,
      accept_rules,
      has_companion,
      companions: [],
      personal_passport_path: null,
      status: "nouvelle",
    };

    const { error: insertError } = await supabaseAdmin.from("registrations").insert([payload]);
    if (insertError) {
      return jsonResponse({ success: false, error: "Registration insert failed" }, 500, origin);
    }

    let personalPassportPath: string | null = null;
    if (parsedPersonalPassport) {
      personalPassportPath = await uploadDocument(
        supabaseAdmin,
        registrationId,
        "participant",
        parsedPersonalPassport,
      );
    }

    const storedCompanions = [];
    for (let index = 0; index < parsedCompanions.length; index += 1) {
      const companion = parsedCompanions[index];
      const passportPath = await uploadDocument(
        supabaseAdmin,
        registrationId,
        "companions",
        companion.passport,
        index + 1,
      );

      storedCompanions.push({
        full_name: companion.full_name,
        passport_path: passportPath,
        passport_name: companion.passport.name,
      });
    }

    const { error: updateError } = await supabaseAdmin
      .from("registrations")
      .update({
        personal_passport_path: personalPassportPath,
        companions: storedCompanions,
      })
      .eq("id", registrationId);

    if (updateError) {
      return jsonResponse({ success: false, error: "Registration documents update failed" }, 500, origin);
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL");
    const senderName = Deno.env.get("BREVO_SENDER_NAME") || "Medina Chess Festival";

    if (brevoApiKey && senderEmail) {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <title>Confirmation d'inscription</title>
          </head>
          <body style="margin:0;padding:0;background:#f6f8fb;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
              <div style="background:#0f172a;padding:24px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;">Medina Chess Festival</h1>
              </div>
              <div style="padding:32px;">
                <h2 style="margin-top:0;color:#111827;">Bienvenue 👋</h2>
                <p style="color:#374151;font-size:16px;line-height:1.6;">
                  Votre inscription a bien été enregistrée.
                </p>
                <div style="margin:24px 0;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                  <p style="margin:0;color:#111827;"><strong>Nom :</strong> ${escapeHtml(full_name)}</p>
                  <p style="margin:0;color:#111827;"><strong>Email :</strong> ${escapeHtml(email)}</p>
                  <p style="margin:0;color:#111827;"><strong>Pays :</strong> ${escapeHtml(country)}</p>
                </div>
                <p style="color:#374151;font-size:16px;line-height:1.6;">Nous vous contacterons si nécessaire.</p>
                <p style="color:#374151;font-size:16px;line-height:1.6;">Cordialement,</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [{ email, name: full_name }],
          subject: "Confirmation d'inscription",
          htmlContent,
        }),
      });
    }

    return jsonResponse(
      {
        success: true,
        message: "Inscription enregistrée avec succès.",
      },
      200,
      origin,
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error",
      },
      500,
      origin,
    );
  }
});
