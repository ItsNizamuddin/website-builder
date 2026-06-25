import { NextResponse } from "next/server";
import { getResolvedConfig, fetchFromBackend } from "@/lib/apiProxy";

// GET /api/search?q=query - Secure server-side search api router
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const cleanQuery = query.trim().toLowerCase();

    // 1. If apiKey is configured, forward search query and authenticate securely
    const { apiKey } = await getResolvedConfig();
    if (apiKey && cleanQuery) {
      try {
        const queryParams = new URLSearchParams({
          q: cleanQuery,
          limit: "20"
        });
        const res = await fetchFromBackend("/search", {
          queryParams
        });
        if (res.ok) {
          const data = await res.json();
          const backendData = data.data || {};
          const courses = (backendData.courses || []).map((c: any) => ({
            title: c.course_title || c.course_name || c.title || "",
            url: `/courses/${c.slug || ""}`,
          }));
          const articles = (backendData.blogs || []).map((b: any) => ({
            title: b.title || "",
            url: `/blogs/${b.slug || ""}`,
          }));
          return NextResponse.json({ courses, articles });
        }
        console.warn(`Remote search returned status: ${res.status}. Returning empty.`);
      } catch (err: any) {
        console.error("Remote Search API failed, returning empty search results:", err.message);
      }
    }

    // Return empty results if unconfigured or remote API fails (completely removing static defaults)
    return NextResponse.json({ courses: [], articles: [] });
  } catch (error: any) {
    console.error("Search failed:", error.message);
    return NextResponse.json({ courses: [], articles: [] });
  }
}
