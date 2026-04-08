import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const DOCUMENT_BUCKET = "registration-documents";

function parseAllowedOrigins() {
  return (Deno.env.get("ALLOWED_ORIGINS") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function isOriginAllowed(origin: string) {
  const allowedOrigins = parseAllowedOrigins();
  if (!origin) return allowedOrigins.length === 0;
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
}

function buildCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json",
  };

  if (origin && isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function jsonResponse(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: buildCorsHeaders(origin),
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    if (origin && !isOriginAllowed(origin)) {
      return jsonResponse({ success: false, error: "Origin not allowed" }, 403, origin);
    }
    return new Response("ok", { headers: buildCorsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405, origin);
  }

  if (origin && !isOriginAllowed(origin)) {
    return jsonResponse({ success: false, error: "Origin not allowed" }, 403, origin);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ success: false, error: "Missing authorization header" }, 401, origin);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401, origin);
    }

    const { data: adminRow, error: adminError } = await adminClient
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError || !adminRow) {
      return jsonResponse({ success: false, error: "Forbidden" }, 403, origin);
    }

    const body = await req.json().catch(() => null);
    const registrationId = String(body?.registrationId || "").trim();

    if (!registrationId) {
      return jsonResponse({ success: false, error: "Missing registrationId" }, 400, origin);
    }

    const { data: registration, error: registrationError } = await adminClient
      .from("registrations")
      .select("id, personal_passport_path, companions, full_name, email")
      .eq("id", registrationId)
      .maybeSingle();

    if (registrationError || !registration) {
      return jsonResponse({ success: false, error: "Registration not found" }, 404, origin);
    }

    const paths = [registration.personal_passport_path, ...(Array.isArray(registration.companions)
      ? registration.companions.map((item: any) => item?.passport_path)
      : [])]
      .filter(Boolean);

    if (paths.length) {
      const { error: storageError } = await adminClient.storage
        .from(DOCUMENT_BUCKET)
        .remove(paths);

      if (storageError) {
        return jsonResponse({ success: false, error: `Storage delete failed: ${storageError.message}` }, 500, origin);
      }
    }

    const { error: deleteError } = await adminClient
      .from("registrations")
      .delete()
      .eq("id", registrationId);

    if (deleteError) {
      return jsonResponse({ success: false, error: `Registration delete failed: ${deleteError.message}` }, 500, origin);
    }

    return jsonResponse(
      {
        success: true,
        message: `Inscription supprimée : ${registration.full_name || registration.email}`,
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
