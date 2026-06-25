import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Page from "@/models/Page";
import mongoose from "mongoose";

// Helper to find a page by ID or Slug
async function findPage(idOrSlug: string) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const page = await Page.findById(idOrSlug);
    if (page) return page;
  }
  return await Page.findOne({ slug: idOrSlug });
}

// GET /api/pages/[id] - Fetch page by ID or Slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const page = await findPage(id);
    if (!page) {
      return NextResponse.json(
        { success: false, error: "Not found", message: "Page not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Database offline", message: error.message },
      { status: 503 }
    );
  }
}

// PUT /api/pages/[id] - Update/Save Draft
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const body = await request.json();
    let page = await findPage(id);

    if (!page) {
      // If we don't have the page but they want to save it (e.g. initial setup for 'home'), we can upsert it!
      // This makes out-of-the-box setup seamless.
      const name = body.name || "Home Page";
      const slug = id.toLowerCase().replace(/[^a-z0-9-_]/g, "");
      page = await Page.create({
        name,
        slug,
        content: body.content || { sections: [] },
        publishedContent: body.publishedContent || null,
      });
      return NextResponse.json({ success: true, page });
    }

    if (body.name !== undefined) page.name = body.name;
    if (body.slug !== undefined) {
      const cleanSlug = body.slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
      // Check if duplicate slug
      if (cleanSlug !== page.slug) {
        const duplicate = await Page.findOne({ slug: cleanSlug });
        if (duplicate) {
          return NextResponse.json(
            { success: false, error: "Duplicate slug", message: "Slug is already taken" },
            { status: 409 }
          );
        }
        page.slug = cleanSlug;
      }
    }
    if (body.content !== undefined) page.content = body.content;
    
    // Explicitly update updatedAt timestamp
    page.markModified("content");
    await page.save();

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Database offline", message: error.message },
      { status: 503 }
    );
  }
}
