// Backend utilities - using localStorage for offline-first functionality
export function getStoredProducts() {
  return JSON.parse(localStorage.getItem("ncrt_products") || "[]");
}
export function getStoredCategories() {
  return JSON.parse(localStorage.getItem("ncrt_categories") || "[]");
}
