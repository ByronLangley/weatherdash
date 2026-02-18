import { NextRequest, NextResponse } from "next/server";
import { OWM_GEO_URL, GEOCODE_LIMIT, SEARCH_MAX_LENGTH } from "@/lib/constants";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function errorResponse(
  message: string,
  code: string,
  status: number
): NextResponse {
  return NextResponse.json({ error: true, message, code }, { status });
}

export async function GET(request: NextRequest) {
  const context = "API/geocode";
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  logger.info(context, "Request received", { query });

  // Validate
  if (!query || query.length < 2) {
    return errorResponse(
      "Search query must be at least 2 characters",
      "INVALID_INPUT",
      400
    );
  }

  if (query.length > SEARCH_MAX_LENGTH) {
    return errorResponse(
      `Search query must be under ${SEARCH_MAX_LENGTH} characters`,
      "INVALID_INPUT",
      400
    );
  }

  // Sanitize — strip HTML/script tags
  const sanitized = query.replace(/<[^>]*>/g, "").trim();
  if (!sanitized) {
    return errorResponse("Invalid search query", "INVALID_INPUT", 400);
  }

  // Rate limiting
  const ip = getClientIP(request);
  if (!checkRateLimit(ip)) {
    logger.warn(context, "Rate limited", { ip });
    return errorResponse(
      "Too many searches. Please wait a moment.",
      "RATE_LIMITED",
      429
    );
  }

  // Proxy to OWM Geocoding
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    logger.error(context, "Missing OPENWEATHERMAP_API_KEY environment variable");
    return errorResponse(
      "Geocoding service is not configured",
      "INTERNAL_ERROR",
      500
    );
  }

  const owmUrl = `${OWM_GEO_URL}/direct?q=${encodeURIComponent(sanitized)}&limit=${GEOCODE_LIMIT}&appid=${apiKey}`;

  try {
    logger.info(context, "Fetching from OWM geocoding", { query: sanitized });
    const response = await fetch(owmUrl);

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(context, "OWM geocoding error", {
        status: response.status,
        body: errorText,
      });
      return errorResponse(
        "Search is temporarily unavailable",
        "UPSTREAM_ERROR",
        502
      );
    }

    const data = await response.json();
    logger.info(context, "OWM geocoding response received", {
      resultCount: Array.isArray(data) ? data.length : 0,
    });

    return NextResponse.json(data);
  } catch (err) {
    logger.error(context, "Failed to fetch from OWM geocoding", err);
    return errorResponse(
      "Search is temporarily unavailable",
      "UPSTREAM_ERROR",
      502
    );
  }
}
