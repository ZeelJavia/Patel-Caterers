// src/pages/Dashboard.jsx (Corrected with Dual PDF Downloads)

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Download,
  Trash2,
  Calendar,
  User,
  MapPin,
  FileText, // <-- 1. IMPORT THE NEW ICON
} from "lucide-react";

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const data = await response.json();
      setEvents(data);
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
        await fetch(`http://localhost:5000/api/events/${id}`, {
          method: "DELETE",
        });
        fetchEvents(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  // --- 2. MODIFIED: This function now handles BOTH download types ---
  const handleDownload = (id, type) => {
    // It constructs the correct URL based on the 'type' parameter
    const url = `http://localhost:5000/api/events/${id}/${type}-pdf`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* This commented-out header is preserved as you had it */}
      {/* <div>
        <img
          src="header.jpg"
          alt="TGP"
          style={{ width: "100%", height: "auto" }}
        />
      </div> */}
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Event Dashboard
            </h1>
            {/* The "Add New Event" button is correctly preserved */}
            <Link
              to="/add-event"
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Event</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <h2
                    className="text-2xl font-bold text-gray-900 mb-2 truncate"
                    title={event.eventName}
                  >
                    {event.eventName}
                  </h2>
                  <div className="text-gray-600 space-y-2 mb-4">
                    <p className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-red-500" />{" "}
                      {event.clientName}
                    </p>
                    <p className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-red-500" />{" "}
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />{" "}
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* --- 3. MODIFIED: The button section now has two download options --- */}
                <div className="flex items-center justify-end space-x-2 border-t pt-4 mt-4">
                  <Link
                    to={`/edit-event/${event._id}`}
                    className="p-2 text-gray-500 hover:text-blue-600"
                    title="Edit Event"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>

                  {/* Button for the new Event Quotation format */}
                  <button
                    onClick={() => handleDownload(event._id, "event")}
                    className="p-2 text-gray-500 hover:text-green-600"
                    title="Download Event Quotation PDF"
                  >
                    <FileText className="w-5 h-5" />
                  </button>

                  {/* Button for the original Category Menu format */}
                  <button
                    onClick={() => handleDownload(event._id, "category")}
                    className="p-2 text-gray-500 hover:text-purple-600"
                    title="Download Master Menu PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 text-gray-500 hover:text-red-600"
                    title="Delete Event"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
