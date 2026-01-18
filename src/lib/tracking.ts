export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getTrackingData() {
  return {
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  };
}
