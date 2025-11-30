// API configuration for both JSON and MongoDB modes
const API_CONFIG = {
  // JSON File Mode (original)
  JSON_MODE: {
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",
    EVENTS: "/api/events",
    MENU_DATA: "/api/menu-data",
    PDF_GENERATION: "/generate-pdf",
    MENU_PDF: "/generate-menu-pdf",
  },

  // MongoDB Mode (new)
  MONGODB_MODE: {
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",
    EVENTS: "/api/events",
    CONTACTS: "/api/contacts",
    MENU_ITEMS: "/api/menu-items",
    AUTH: "/api/auth",
    ADMIN: "/api/admin",
    MENU_DATA: "/api/menu-data",
    HEALTH: "/api/health",
  },
};

// Switch between modes - set to 'MONGODB_MODE' to use MongoDB
const CURRENT_MODE = "MONGODB_MODE";

export const API_BASE_URL = API_CONFIG[CURRENT_MODE].BASE_URL;
export const ENDPOINTS = API_CONFIG[CURRENT_MODE];

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Pre-built common URLs
export const API_URLS = {
  EVENTS: buildApiUrl(ENDPOINTS.EVENTS),
  CONTACTS: buildApiUrl(ENDPOINTS.CONTACTS),
  MENU_ITEMS: buildApiUrl(ENDPOINTS.MENU_ITEMS),
  AUTH: buildApiUrl(ENDPOINTS.AUTH),
  ADMIN: buildApiUrl(ENDPOINTS.ADMIN),
  MENU_DATA: buildApiUrl(ENDPOINTS.MENU_DATA),
  HEALTH: buildApiUrl(ENDPOINTS.HEALTH),
};
