import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Page from "@/models/Page";

// GET /api/pages - List all pages
export async function GET() {
  try {
    await connectToDatabase();
    const pages = await Page.find({}, { name: 1, slug: 1, createdAt: 1, updatedAt: 1 });
    return NextResponse.json({ success: true, pages });
  } catch (error: any) {
    console.error("Database connection failed, running in offline mode:", error.message);
    return NextResponse.json(
      { success: false, error: "Database offline", message: error.message },
      { status: 503 } // Service Unavailable
    );
  }
}

// POST /api/pages - Create a new page
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Validation failed", message: "Name and Slug are required" },
        { status: 400 }
      );
    }

    // Clean slug
    const cleanSlug = body.slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");

    // Check if slug exists
    const existing = await Page.findOne({ slug: cleanSlug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Duplicate slug", message: "A page with this slug already exists" },
        { status: 409 }
      );
    }

    const newPage = await Page.create({
      name: body.name,
      slug: cleanSlug,
      content: body.content || { sections: [] },
      publishedContent: body.publishedContent || null,
    });

    return NextResponse.json({ success: true, page: newPage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Database offline", message: error.message },
      { status: 503 }
    );
  }
}
