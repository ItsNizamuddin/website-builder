import { connectToDatabase } from "./db";
import SiteSettings from "@/models/SiteSettings";
import { env } from "./env";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  queryParams?: URLSearchParams;
}

export async function getResolvedConfig() {
  const apiBaseUrl = env.API_BASE_URL; // Permanent URL from env parser
  let apiKey = env.API_KEY;

  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne({ key: "global" });
    if (settings && settings.apiKey) {
      apiKey = settings.apiKey;
    }
  } catch (err: any) {
    console.warn("Failed to load apiKey from database settings, using env fallback:", err.message);
  }

  return { apiBaseUrl, apiKey };
}

async function fetchInternal(endpoint: string, options: FetchOptions = {}, isPublic = false) {
  const { apiBaseUrl, apiKey } = await getResolvedConfig();
  
  // Format endpoint to ensure it has a leading slash
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  // Define path prefix: content endpoints get prepended with '/content', public ones bypass it
  const prefix = isPublic ? "" : "/content";
  let backendUrl = `${apiBaseUrl}${prefix}${formattedEndpoint}`;

  if (options.queryParams) {
    const separator = backendUrl.includes("?") ? "&" : "?";
    backendUrl = `${backendUrl}${separator}${options.queryParams.toString()}`;
  }

  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  let response = await fetch(backendUrl, {
    ...options,
    headers,
  });

  // Authentication Failover: If status is 401, retry using Bearer token format
  if (response.status === 401 && apiKey) {
    headers["Authorization"] = apiKey.startsWith("Bearer ") ? apiKey : `Bearer ${apiKey}`;
    delete headers["x-api-key"];
    
    response = await fetch(backendUrl, {
      ...options,
      headers,
    });
  }

  return response;
}

/**
 * Fetch a content API endpoint from Skilldeck backend (automatically prepends '/content').
 */
export async function fetchFromBackend(endpoint: string, options: FetchOptions = {}) {
  return fetchInternal(endpoint, options, false);
}

/**
 * Fetch a public API endpoint from Skilldeck backend (direct URL mapping bypassing '/content').
 */
export async function fetchPublicFromBackend(endpoint: string, options: FetchOptions = {}) {
  return fetchInternal(endpoint, options, true);
}
