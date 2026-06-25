import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { env } from "@/lib/env";

// GET /api/settings - Fetch global site settings
export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findOne({ key: "global" });
    if (!settings) {
      // Upsert default document with environment fallback
      settings = await SiteSettings.create({
        key: "global",
        apiKey: env.API_KEY,
      });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.warn("Failed to fetch settings from DB, returning env fallback:", error.message);
    return NextResponse.json({
      success: true,
      settings: {
        apiKey: env.API_KEY,
      },
      offline: true,
    });
  }
}

// POST /api/settings - Save/Update global site settings
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const updateFields: any = {};
    if (body.apiKey !== undefined) updateFields.apiKey = body.apiKey;
    if (body.primaryColor !== undefined) updateFields.primaryColor = body.primaryColor;
    if (body.secondaryColor !== undefined) updateFields.secondaryColor = body.secondaryColor;
    if (body.gradientStart !== undefined) updateFields.gradientStart = body.gradientStart;
    if (body.gradientEnd !== undefined) updateFields.gradientEnd = body.gradientEnd;
    if (body.globalHeader !== undefined) updateFields.globalHeader = body.globalHeader;
    if (body.globalFooter !== undefined) updateFields.globalFooter = body.globalFooter;
    if (body.logoImg !== undefined) updateFields.logoImg = body.logoImg;
    if (body.logoText !== undefined) updateFields.logoText = body.logoText;

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      {
        $set: updateFields,
        $unset: { searchApiUrl: "", searchApiToken: "" },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Failed to save settings to DB:", error.message);
    return NextResponse.json(
      { success: false, error: "Database offline", message: error.message },
      { status: 503 }
    );
  }
}
