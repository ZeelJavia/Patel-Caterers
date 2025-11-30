import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Users,
  Mail,
  Key,
  X,
  Save,
  Trash2,
  RotateCcw,
} from "lucide-react";
import ApiService from "../services/ApiService";
import { useAuth } from "../contexts/AuthContext";

const AdminManagement = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors

      const data = await ApiService.getAllAdmins();
      console.log("Admin API response data:", data);
      setAdmins(data.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      if (error.message.includes("401")) {
        setError("Session expired. Please login again.");
        setTimeout(() => {
          logout();
          onClose();
        }, 2000);
      } else {
        setError(`Error fetching admin users: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create new admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await ApiService.createAdminUser(formData);
      setSuccess("Admin user created successfully!");
      setFormData({ email: "", password: "", username: "" });
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error("Error creating admin:", error);
      setError(error.message || "Error creating admin user");
    } finally {
      setLoading(false);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId) => {
    if (
      !window.confirm("Are you sure you want to deactivate this admin user?")
    ) {
      return;
    }

    try {
      await ApiService.deleteAdminUser(adminId);
      setSuccess("Admin user deactivated successfully");
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError(error.message || "Error deactivating admin user");
    }
  };

  // Load admins when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              Admin Management
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Add New Admin Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserPlus className="h-5 w-5 text-green-600 mr-2" />
              Add New Admin
            </h3>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username (Optional)
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave empty to auto-generate from email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-top-transparent"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Add Admin</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Existing Admins List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Existing Admin Users ({admins.length})
            </h3>

            {loading && !admins.length ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-top-transparent"></div>
                <span className="ml-2 text-gray-600">Loading admins...</span>
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No admin users found
              </div>
            ) : (
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div
                    key={admin._id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      admin.isActive
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              admin.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {admin.username}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>Role: {admin.role}</span>
                          <span>
                            Created:{" "}
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </span>
                          {admin.lastLogin && (
                            <span>
                              Last Login:{" "}
                              {new Date(admin.lastLogin).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            admin.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>

                        {admin.isActive && (
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Deactivate Admin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Only active admin users can manage other admin accounts
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
