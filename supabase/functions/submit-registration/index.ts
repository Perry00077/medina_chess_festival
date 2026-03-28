import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

function parseAllowedOrigins() {
  return (Deno.env.get("ALLOWED_ORIGINS") || "")
    .split(",")
    .map((v) => v.trim())
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
    const website = body?.website?.trim() || "";

    if (website) {
      return jsonResponse({ success: false, error: "Bot detected" }, 400, origin);
    }

    if (!turnstileToken) {
      return jsonResponse({ success: false, error: "Missing CAPTCHA token" }, 400, origin);
    }

    if (!first_name || !last_name || !email || !country || !accept_rules) {
      return jsonResponse({ success: false, error: "Missing required fields" }, 400, origin);
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

    const payload = {
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
      status: "nouvelle",
    };

    const { error: insertError } = await supabaseAdmin
      .from("registrations")
      .insert([payload]);

    if (insertError) {
      return jsonResponse(
        {
          success: false,
          error: "Registration insert failed",
        },
        500,
        origin,
      );
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
                  <p style="margin:0;color:#111827;"><strong>Name :</strong> ${escapeHtml(full_name)}</p>
                  <p style="margin:0;color:#111827;"><strong>Email :</strong> ${escapeHtml(email)}</p>
                  <p style="margin:0;color:#111827;"><strong>Country :</strong> ${escapeHtml(country)}</p>
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
          "accept": "application/json",
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
  } catch {
    return jsonResponse(
      {
        success: false,
        error: "Unexpected server error",
      },
      500,
      origin,
    );
  }
});