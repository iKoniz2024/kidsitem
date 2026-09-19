// export function getApiUrl() {
//   let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//   url = url.trim().replace(/\/+$/, "");
//   if (!url.endsWith("/api")) {
//     url += "/api";
//   }
//   return url;
// }


export function getApiUrl() {
  let url = process.env.NEXT_PUBLIC_API_URL || process.env.INTERNAL_API_URL;

  if (!url) {
    url = typeof window !== "undefined" || process.env.NODE_ENV === "production"
      ? "https://kitsitem-backend.vercel.app/api"
      : "http://localhost:5000/api";
  }

  url = url.trim().replace(/\/+$/, "");

  if (!url.endsWith("/api")) {
    url += "/api";
  }

  return url;
}