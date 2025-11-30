// src/pages/Dashboard.jsx (Corrected with Dual PDF Downloads)

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiService from "../services/ApiService";
import {
  Plus,
  Edit,
  Download,
  Trash2,
  Calendar,
  User,
  MapPin,
  FileText,
  ChefHat,
  Menu,
  Users,
} from "lucide-react";
import mainLogo from "../assets/main-logo.png";
import AdminManagement from "../components/AdminManagement";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const data = await ApiService.getAllEvents();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await ApiService.deleteEvent(id);
        fetchEvents(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  // --- 2. MODIFIED: This function now handles BOTH download types ---
  const handleDownload = (id, type) => {
    // It constructs the correct URL based on the 'type' parameter
    const url = ApiService.getEventPdfUrl(id, type);
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-6 sm:mb-0">
                <div className="flex items-center space-x-6 mb-3">
                  <div className="bg-white bg-opacity-20 rounded-full p-4 shadow-lg ring-2 ring-white ring-opacity-30">
                    <img
                      src={mainLogo}
                      alt="Patel Caterers Logo"
                      className="h-14 w-14 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
                      Patel Caterers
                    </h1>
                    <div className="flex items-center space-x-2 text-slate-300">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">
                        Professional Catering Services
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                  Manage your catering events and generate professional
                  quotations with ease
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/add-event"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Event</span>
                </Link>
                <Link
                  to="/menu-management"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  <ChefHat className="h-5 w-5" />
                  <span>Menu Items</span>
                </Link>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  <Users className="h-5 w-5" />
                  <span>Manage Admins</span>
                </button>
              </div>
            </div>

            {/* Decorative bottom border */}
            <div className="mt-8 flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full opacity-50"></div>
            </div>
          </div>
        </div>{" "}
        {/* Events Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No events yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first catering event to get started
                </p>
                <Link
                  to="/add-event"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Add Event
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      {/* Event Info Section */}
                      <Link
                        to={`/edit-event/${event._id}`}
                        className="flex-1 mb-6 md:mb-0 cursor-pointer hover:opacity-75 transition-opacity block"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                              {event.eventName}
                            </h2>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                                {event.subEvents?.length || 0} Sub-Events
                              </span>
                              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                Created{" "}
                                {new Date(
                                  event.createdAt || event.eventDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-600">
                          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                            <User className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">
                                Client
                              </p>
                              <p className="font-semibold text-gray-800 truncate">
                                {event.clientName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                            <Calendar className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">
                                Date
                              </p>
                              <p className="font-semibold text-gray-800 truncate">
                                {new Date(event.eventDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                            <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">
                                Location
                              </p>
                              <p
                                className="font-semibold text-gray-800 truncate"
                                title={event.location}
                              >
                                {event.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Action Buttons Section - 2x2 Grid */}
                      <div className="grid grid-cols-2 gap-3 md:ml-8 w-full max-w-xs">
                        <Link
                          to={`/edit-event/${event._id}`}
                          className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium text-sm"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDownload(event._id, "event")}
                          className="flex items-center justify-center space-x-2 bg-green-50 text-green-600 px-4 py-3 rounded-lg hover:bg-green-100 transition-all duration-200 font-medium text-sm"
                          title="Download Event Quotation PDF"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Menu</span>
                        </button>

                        <button
                          onClick={() => handleDownload(event._id, "billing")}
                          className="flex items-center justify-center space-x-2 bg-yellow-50 text-yellow-600 px-4 py-3 rounded-lg hover:bg-yellow-100 transition-all duration-200 font-medium text-sm"
                          title="Download Billing Invoice PDF"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Invoice</span>
                        </button>

                        <button
                          onClick={() => handleDelete(event._id)}
                          className="flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-sm"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Management Modal */}
      <AdminManagement
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </>
  );
};

export default Dashboard;
