import { NextResponse } from "next/server";
import { fetchPublicFromBackend } from "@/lib/apiProxy";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetchPublicFromBackend("/public/payments/submit", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("Failed to proxy payment submit request:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
