import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const headersList = request.headers;
    let ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "8.8.8.8";

    // Clean up local development IPs
    if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
      ip = "8.8.8.8"; // Default fallback to a known public IP for testing
    }

    const url = `http://ip-api.com/json/${ip}?fields=city,query,country,countryCode,timezone,region,regionName,status`;
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Location lookup error:", err.message);
    return NextResponse.json({ status: "fail", message: err.message }, { status: 500 });
  }
}
