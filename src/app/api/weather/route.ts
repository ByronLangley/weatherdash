import { NextRequest, NextResponse } from "next/server";
import { OWM_BASE_URL } from "@/lib/constants";
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
  const context = "API/weather";
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const type = searchParams.get("type") ?? "current"; // "current" | "forecast"

  logger.info(context, "Request received", { lat, lon, type });

  // Validate params
  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (!lat || !lon || isNaN(latNum) || isNaN(lonNum)) {
    logger.warn(context, "Invalid parameters", { lat, lon });
    return errorResponse(
      "Valid lat and lon parameters are required",
      "INVALID_INPUT",
      400
    );
  }

  if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    logger.warn(context, "Coordinates out of range", { lat: latNum, lon: lonNum });
    return errorResponse(
      "Coordinates out of valid range",
      "INVALID_INPUT",
      400
    );
  }

  if (type !== "current" && type !== "forecast") {
    return errorResponse(
      'Type must be "current" or "forecast"',
      "INVALID_INPUT",
      400
    );
  }

  // Rate limiting
  const ip = getClientIP(request);
  if (!checkRateLimit(ip)) {
    logger.warn(context, "Rate limited", { ip });
    return errorResponse(
      "Too many requests. Please wait a moment.",
      "RATE_LIMITED",
      429
    );
  }

  // Proxy to OWM
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    logger.error(context, "Missing OPENWEATHERMAP_API_KEY environment variable");
    return errorResponse(
      "Weather service is not configured",
      "INTERNAL_ERROR",
      500
    );
  }

  const endpoint = type === "forecast" ? "forecast" : "weather";
  const owmUrl = `${OWM_BASE_URL}/${endpoint}?lat=${latNum}&lon=${lonNum}&units=metric&appid=${apiKey}`;

  try {
    logger.info(context, `Fetching from OWM ${endpoint}`, { lat: latNum, lon: lonNum });
    const response = await fetch(owmUrl);

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(context, "OWM API error", {
        status: response.status,
        body: errorText,
      });
      return errorResponse(
        "Weather data is temporarily unavailable",
        "UPSTREAM_ERROR",
        502
      );
    }

    const data = await response.json();
    logger.info(context, `OWM ${endpoint} response received`, {
      status: response.status,
    });

    return NextResponse.json(data);
  } catch (err) {
    logger.error(context, "Failed to fetch from OWM", err);
    return errorResponse(
      "Weather service is temporarily unavailable",
      "UPSTREAM_ERROR",
      502
    );
  }
}
