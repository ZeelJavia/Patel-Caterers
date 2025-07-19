// src/pages/EventForm.jsx (Final version with all buttons restored)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// --- MODIFIED: Added Download and ChevronDown icons ---
import {
  Save,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
} from "lucide-react";
import { menuData } from "../data/menuData";
import MenuSelectionModal from "../components/MenuSelectionModal";

const EventForm = () => {
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    clientName: "",
    eventDate: "",
    location: "",
    contactInfo: "",
  });
  const [subEvents, setSubEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubEventIndex, setEditingSubEventIndex] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showPdfMenu, setShowPdfMenu] = useState(false); // --- State for PDF dropdown

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // This useEffect for fetching data is correct and unchanged
  useEffect(() => {
    if (isEditing) {
      fetch(`http://localhost:5000/api/events/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setEventDetails({
            eventName: data.eventName || "",
            clientName: data.clientName,
            eventDate: new Date(data.eventDate).toISOString().split("T")[0],
            location: data.location,
            contactInfo: data.contactInfo,
          });
          setSubEvents(data.subEvents || []);
        });
    }
  }, [id, isEditing]);

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const addSubEvent = () => {
    const newSubEvent = {
      id: crypto.randomUUID(),
      name: `Meal #${subEvents.length + 1}`,
      date: eventDetails.eventDate || "", // Default to main event date
      pax: "0",
      price: "0",
      items: {},
    };
    setSubEvents([...subEvents, newSubEvent]);
    setActiveAccordion(subEvents.length);
  };

  const updateSubEventField = (index, field, value) => {
    const updated = [...subEvents];
    updated[index][field] = value;
    setSubEvents(updated);
  };

  const removeSubEvent = (index) => {
    if (window.confirm("Are you sure you want to remove this meal section?")) {
      setSubEvents(subEvents.filter((_, i) => i !== index));
    }
  };

  const openMenuModal = (index) => {
    setEditingSubEventIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveMenu = (newItems) => {
    updateSubEventField(editingSubEventIndex, "items", newItems);
    setIsModalOpen(false);
    setEditingSubEventIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalEventData = { ...eventDetails, subEvents };
    const url = isEditing
      ? `http://localhost:5000/api/events/${id}`
      : "http://localhost:5000/api/events";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalEventData),
      });
      if (response.ok) {
        alert(`Event ${isEditing ? "updated" : "saved"} successfully!`);
        if (!isEditing) {
          const savedEvent = await response.json();
          navigate(`/edit-event/${savedEvent.event._id}`); // Redirect to edit page after creating
        }
      } else {
        throw new Error("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Error saving event.");
    }
  };

  // --- PDF Download Handler ---
  const handleDownload = (type) => {
    const url = `http://localhost:5000/api/events/${id}/${type}-pdf`;
    window.open(url, "_blank");
    setShowPdfMenu(false); // Close the dropdown after clicking
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit}>
        {/* --- HEADER WITH ALL BUTTONS RESTORED --- */}
        <header className="bg-white shadow-md sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditing ? "Edit Event" : "Add New Event"}
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-gray-700 hover:text-gray-900 flex items-center space-x-2"
                >
                  <ArrowLeft className="h-5 w-5" /> <span>Dashboard</span>
                </button>

                {/* --- PDF DOWNLOAD DROPDOWN (RESTORED) --- */}
                {isEditing && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPdfMenu(!showPdfMenu)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
                    >
                      <Download className="h-5 w-5" />
                      <span>Generate PDF</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showPdfMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showPdfMenu && (
                      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30">
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => handleDownload("event")}
                            className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FileText className="w-4 h-4 text-green-700" />
                            <span>Event Quotation</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload("category")}
                            className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Download className="w-4 h-4 text-purple-700" />
                            <span>Master Menu</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
                >
                  <Save className="h-5 w-5" />
                  <span>{isEditing ? "Update Event" : "Save Event"}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-8">
          {/* ... The rest of the form (Event Details, Sub-Events) is unchanged and correct ... */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="eventName"
                value={eventDetails.eventName}
                onChange={handleDetailChange}
                placeholder="Event Name (e.g., Wedding, Birthday Party)"
                className="p-2 border rounded"
                required
              />
              <input
                name="clientName"
                value={eventDetails.clientName}
                onChange={handleDetailChange}
                placeholder="Client Name"
                className="p-2 border rounded"
                required
              />
              <input
                name="eventDate"
                value={eventDetails.eventDate}
                onChange={handleDetailChange}
                type="date"
                className="p-2 border rounded"
                required
              />
              <input
                name="location"
                value={eventDetails.location}
                onChange={handleDetailChange}
                placeholder="Event Location"
                className="p-2 border rounded"
                required
              />
              <input
                name="contactInfo"
                value={eventDetails.contactInfo}
                onChange={handleDetailChange}
                placeholder="Contact Info (Email/Phone)"
                className="p-2 border rounded md:col-span-2"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Meals / Sub-Events</h2>
              <button
                type="button"
                onClick={addSubEvent}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" /> <span>Add Meal</span>
              </button>
            </div>
            <div className="space-y-4">
              {subEvents.map((subEvent, index) => (
                <div
                  key={subEvent.id || index}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                      value={subEvent.name}
                      onChange={(e) =>
                        updateSubEventField(index, "name", e.target.value)
                      }
                      placeholder="Meal Name (e.g., Lunch)"
                      className="p-2 border rounded"
                    />
                    <input
                      value={subEvent.date}
                      onChange={(e) =>
                        updateSubEventField(index, "date", e.target.value)
                      }
                      type="date"
                      className="p-2 border rounded"
                      title="Sub-event Date"
                    />
                    <input
                      value={subEvent.pax}
                      onChange={(e) =>
                        updateSubEventField(index, "pax", e.target.value)
                      }
                      placeholder="PAX"
                      type="number"
                      className="p-2 border rounded"
                    />
                    <input
                      value={subEvent.price}
                      onChange={(e) =>
                        updateSubEventField(index, "price", e.target.value)
                      }
                      placeholder="Price P.P."
                      type="number"
                      className="p-2 border rounded"
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => openMenuModal(index)}
                        className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg flex-grow flex items-center justify-center space-x-2 hover:bg-gray-300"
                      >
                        <Edit className="w-4 h-4" /> <span>Edit Menu</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSubEvent(index)}
                        className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveAccordion(
                          activeAccordion === index ? null : index
                        )
                      }
                      className="w-full text-left text-sm font-medium text-gray-600 flex justify-between items-center p-1"
                    >
                      <span>
                        View Selected Items (
                        {Object.values(subEvent.items).flat().length})
                        {subEvent.date && (
                          <span className="text-xs text-gray-500 ml-2">
                            - {new Date(subEvent.date).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                      {activeAccordion === index ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {activeAccordion === index && (
                      <div className="p-3 mt-2 bg-white rounded border text-xs">
                        {Object.values(subEvent.items).flat().length > 0 ? (
                          <ul className="list-disc pl-4 columns-2">
                            {Object.entries(subEvent.items).flatMap(
                              ([catId, items]) =>
                                items.map((itemId) => {
                                  const category = menuData.find(
                                    (c) => c.id === catId
                                  );
                                  const item = category?.items.find(
                                    (i) => i.id === itemId
                                  );
                                  return item ? (
                                    <li key={item.id}>{item.name}</li>
                                  ) : null;
                                })
                            )}
                          </ul>
                        ) : (
                          <p className="text-gray-500">
                            No items selected for this meal.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>

      {isModalOpen && (
        <MenuSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialSelections={subEvents[editingSubEventIndex]?.items || {}}
          onSave={handleSaveMenu}
        />
      )}
    </div>
  );
};

export default EventForm;
