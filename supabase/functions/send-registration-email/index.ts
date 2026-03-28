import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const rawAllowedOrigins = Deno.env.get("ALLOWED_ORIGINS") || "";
const allowedOrigins = rawAllowedOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsBaseHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: buildCorsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return jsonResponse(origin, { success: false, error: "Method not allowed" }, 405);
  }

  if (!isOriginAllowed(origin)) {
    return jsonResponse(origin, { success: false, error: "Origin not allowed" }, 403);
  }

  try {
    const body = await req.json().catch(() => null);

    const email = sanitizeEmail(body?.email);
    const firstName = sanitizeText(body?.first_name, 80);
    const lastName = sanitizeText(body?.last_name, 80);
    const fullName = sanitizeText(body?.full_name, 170) || `${firstName} ${lastName}`.trim() || "Utilisateur";
    const country = sanitizeText(body?.country, 80);

    if (!email) {
      return jsonResponse(origin, { success: false, error: "A valid email is required" }, 400);
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL");
    const senderName = Deno.env.get("BREVO_SENDER_NAME") || "Medina Chess Festival";

    if (!brevoApiKey) {
      return jsonResponse(origin, { success: false, error: "Missing BREVO_API_KEY secret" }, 500);
    }

    if (!senderEmail) {
      return jsonResponse(origin, { success: false, error: "Missing BREVO_SENDER_EMAIL secret" }, 500);
    }

    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeCountry = escapeHtml(country || "—");

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
              <p style="color:#374151;font-size:16px;line-height:1.6;">Votre inscription a bien été enregistrée.</p>

              <div style="margin:24px 0;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                <p style="margin:0;color:#111827;"><strong>Nom :</strong> ${safeFullName}</p>
                <p style="margin:0;color:#111827;"><strong>Email :</strong> ${safeEmail}</p>
                <p style="margin:0;color:#111827;"><strong>Pays :</strong> ${safeCountry}</p>
              </div>

              <p style="color:#374151;font-size:16px;line-height:1.6;">Nous vous contacterons si nécessaire.</p>
              <p style="color:#374151;font-size:16px;line-height:1.6;">Cordialement,</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email, name: fullName }],
        subject: "Confirmation d'inscription",
        htmlContent,
      }),
    });

    if (!brevoResponse.ok) {
      return jsonResponse(origin, { success: false, error: "Email provider request failed" }, brevoResponse.status);
    }

    const brevoData = await brevoResponse.json().catch(() => ({}));

    return jsonResponse(origin, { success: true, message: "Registration email sent successfully", data: brevoData }, 200);
  } catch (error) {
    return jsonResponse(origin, { success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

function buildCorsHeaders(origin: string) {
  return {
    ...corsBaseHeaders,
    "Access-Control-Allow-Origin": isOriginAllowed(origin) ? origin || "*" : allowedOrigins[0] || "null",
  };
}

function jsonResponse(origin: string, data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...buildCorsHeaders(origin),
      "Content-Type": "application/json",
    },
  });
}

function isOriginAllowed(origin: string) {
  if (!origin) return allowedOrigins.length === 0;
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
}

function sanitizeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function sanitizeEmail(value: unknown) {
  if (typeof value !== "string") return "";
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
