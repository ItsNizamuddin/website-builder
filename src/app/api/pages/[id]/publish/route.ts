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

// POST /api/pages/[id]/publish - Copy draft content to publishedContent
export async function POST(
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

    // Set publishedContent to match draft content
    page.publishedContent = {
      sections: JSON.parse(JSON.stringify(page.content.sections)),
    };
    
    page.markModified("publishedContent");
    await page.save();

    return NextResponse.json({
      success: true,
      message: "Page published successfully",
      publishedContent: page.publishedContent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Database offline", message: error.message },
      { status: 503 }
    );
  }
}
