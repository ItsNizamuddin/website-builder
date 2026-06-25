import { NextResponse } from "next/server";
import { fetchPublicFromBackend } from "@/lib/apiProxy";

export async function GET() {
  try {
    const response = await fetchPublicFromBackend("/public/payments/keys", {
      method: "GET",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error("Failed to proxy payment keys request:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
