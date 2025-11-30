import { API_URLS, API_BASE_URL } from "../config/api.js";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("patel_caterers_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API Service class
class ApiService {
  // Events API
  static async getAllEvents() {
    const response = await fetch(API_URLS.EVENTS);
    return response.json();
  }

  static async getEventById(id) {
    const response = await fetch(`${API_URLS.EVENTS}/${id}`);
    return response.json();
  }

  static async createEvent(eventData) {
    const response = await fetch(API_URLS.EVENTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    return response.json();
  }

  static async updateEvent(id, eventData) {
    const response = await fetch(`${API_URLS.EVENTS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    return response.json();
  }

  static async deleteEvent(id) {
    const response = await fetch(`${API_URLS.EVENTS}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }

  // PDF Generation
  static getEventPdfUrl(id, type) {
    return `${API_URLS.EVENTS}/${id}/${type}-pdf`;
  }

  // Menu Items API
  static async getAllMenuItems() {
    const response = await fetch(API_URLS.MENU_ITEMS);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.status}`);
    }
    return response.json();
  }

  static async getMenuItems() {
    return this.getAllMenuItems();
  }

  static async getMenuCategories() {
    const response = await fetch(`${API_URLS.MENU_ITEMS}/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu categories: ${response.status}`);
    }
    return response.json();
  }

  static async createMenuItem(itemData) {
    const response = await fetch(API_URLS.MENU_ITEMS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(itemData),
    });
    return response.json();
  }

  static async updateMenuItem(id, itemData) {
    const response = await fetch(`${API_URLS.MENU_ITEMS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(itemData),
    });
    return response.json();
  }

  static async deleteMenuItem(id) {
    const response = await fetch(`${API_URLS.MENU_ITEMS}/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.json();
  }

  // Auth API
  static async login(email, password) {
    const response = await fetch(`${API_URLS.AUTH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  // Admin API
  static async getAllAdmins() {
    const response = await fetch(`${API_URLS.ADMIN}/users`, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch admin users: ${response.status}`);
    }
    return response.json();
  }

  static async getAdminUsers() {
    return this.getAllAdmins();
  }

  static async createAdmin(adminData) {
    const response = await fetch(`${API_URLS.ADMIN}/users`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });
    return response.json();
  }

  static async deleteAdmin(id) {
    const response = await fetch(`${API_URLS.ADMIN}/users/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete admin user: ${response.status}`);
    }
    return response.json();
  }

  // Alias methods for admin management
  static async createAdminUser(adminData) {
    return this.createAdmin(adminData);
  }

  static async deleteAdminUser(id) {
    return this.deleteAdmin(id);
  }

  // Contacts API
  static async createContact(contactData) {
    const response = await fetch(API_URLS.CONTACTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });
    return response.json();
  }

  // Health Check
  static async getHealth() {
    const response = await fetch(API_URLS.HEALTH);
    return response.json();
  }
}

export default ApiService;
