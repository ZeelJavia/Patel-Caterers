// src/pages/EventForm.jsx (Final version with all buttons restored)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
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
  MoveUp,
  MoveDown,
  StickyNote,
} from "lucide-react";
// Note: Menu data is now fetched dynamically from the API
import MenuSelectionModal from "../components/MenuSelectionModal";
import NotesModal from "../components/NotesModal";

const EventForm = () => {
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    clientName: "",
    eventDate: "",
    location: "",
    contactInfo: "",
    notes: "",
  });
  const [subEvents, setSubEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubEventIndex, setEditingSubEventIndex] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showPdfMenu, setShowPdfMenu] = useState(false); // --- State for PDF dropdown
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [menuData, setMenuData] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Fetch menu data for display purposes
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const data = await ApiService.getAllMenuItems();

        // Transform menu items into the expected format
        const groupedData = {};
        data.menuItems.forEach((item) => {
          if (!groupedData[item.category]) {
            groupedData[item.category] = {
              id: item.category,
              name:
                item.category.charAt(0).toUpperCase() +
                item.category.slice(1).replace(/-/g, " "),
              items: [],
            };
          }
          groupedData[item.category].items.push({
            id: item._id,
            name: item.name,
            price: item.price,
            isVeg: item.isVeg,
            description: item.description,
            preparationTime: item.preparationTime,
            tags: item.tags,
          });
        });

        const transformedData = Object.values(groupedData);
        setMenuData(transformedData);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  // This useEffect for fetching event data is correct and unchanged
  useEffect(() => {
    if (isEditing) {
      ApiService.getEventById(id).then((data) => {
        setEventDetails({
          eventName: data.eventName || "",
          clientName: data.clientName,
          eventDate: new Date(data.eventDate).toISOString().split("T")[0],
          location: data.location,
          contactInfo: data.contactInfo,
          notes: data.notes || "",
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
      name: "", // Start with empty name instead of default "Meal #X"
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

  const moveSubEventUp = (index) => {
    if (index > 0) {
      const newSubEvents = [...subEvents];
      [newSubEvents[index - 1], newSubEvents[index]] = [
        newSubEvents[index],
        newSubEvents[index - 1],
      ];
      setSubEvents(newSubEvents);
    }
  };

  const moveSubEventDown = (index) => {
    if (index < subEvents.length - 1) {
      const newSubEvents = [...subEvents];
      [newSubEvents[index], newSubEvents[index + 1]] = [
        newSubEvents[index + 1],
        newSubEvents[index],
      ];
      setSubEvents(newSubEvents);
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

  const handleSaveNotes = (notes) => {
    setEventDetails((prev) => ({ ...prev, notes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalEventData = { ...eventDetails, subEvents };

    try {
      let result;
      if (isEditing) {
        result = await ApiService.updateEvent(id, finalEventData);
      } else {
        result = await ApiService.createEvent(finalEventData);
      }

      alert(`Event ${isEditing ? "updated" : "saved"} successfully!`);
      if (!isEditing && result._id) {
        navigate(`/edit-event/${result._id}`); // Redirect to edit page after creating
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Error saving event.");
    }
  };

  // --- PDF Download Handler ---
  const handleDownload = (type) => {
    const url = ApiService.getEventPdfUrl(id, type);
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
                  onClick={() => navigate("/menu-generator")}
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
                          <button
                            type="button"
                            onClick={() => handleDownload("billing")}
                            className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FileText className="w-4 h-4 text-blue-700" />
                            <span>Billing Invoice</span>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Event Details</h2>
              <button
                type="button"
                onClick={() => setIsNotesModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
              >
                <StickyNote className="h-4 w-4" />
                <span>Manage Notes</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  name="eventName"
                  value={eventDetails.eventName}
                  onChange={handleDetailChange}
                  placeholder="e.g., Wedding, Birthday Party, Corporate Event"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  name="clientName"
                  value={eventDetails.clientName}
                  onChange={handleDetailChange}
                  placeholder="Enter client's full name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  name="eventDate"
                  value={eventDetails.eventDate}
                  onChange={handleDetailChange}
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location *
                </label>
                <input
                  name="location"
                  value={eventDetails.location}
                  onChange={handleDetailChange}
                  placeholder="Venue name, address, or location details"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information
                </label>
                <input
                  name="contactInfo"
                  value={eventDetails.contactInfo}
                  onChange={handleDetailChange}
                  placeholder="Phone number, email, or additional contact details"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
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
            <div className="space-y-6">
              {subEvents.map((subEvent, index) => (
                <div
                  key={subEvent.id || index}
                  className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {subEvent.name || `Event ${index + 1}`}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => moveSubEventUp(index)}
                        disabled={index === 0}
                        className={`p-2 rounded-lg ${
                          index === 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        }`}
                        title="Move Up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSubEventDown(index)}
                        disabled={index === subEvents.length - 1}
                        className={`p-2 rounded-lg ${
                          index === subEvents.length - 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        }`}
                        title="Move Down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Name *
                      </label>
                      <input
                        value={subEvent.name}
                        onChange={(e) =>
                          updateSubEventField(index, "name", e.target.value)
                        }
                        placeholder="e.g., Welcome Ceremony, Main Event, Reception"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date
                      </label>
                      <input
                        value={subEvent.date}
                        onChange={(e) =>
                          updateSubEventField(index, "date", e.target.value)
                        }
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests (PAX) *
                      </label>
                      <input
                        value={subEvent.pax}
                        onChange={(e) =>
                          updateSubEventField(index, "pax", e.target.value)
                        }
                        placeholder="e.g., 150"
                        type="number"
                        min="1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Per Person *
                      </label>
                      <input
                        value={subEvent.price}
                        onChange={(e) =>
                          updateSubEventField(index, "price", e.target.value)
                        }
                        placeholder="e.g., 250"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => openMenuModal(index)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Menu</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSubEvent(index)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
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
                                items.map((selectedItem) => {
                                  // Handle both string (legacy) and object format
                                  const itemId =
                                    typeof selectedItem === "string"
                                      ? selectedItem
                                      : selectedItem.id;
                                  const subItems =
                                    typeof selectedItem === "object"
                                      ? selectedItem.subItems || []
                                      : [];

                                  // Handle custom items
                                  if (itemId.startsWith("__custom__:")) {
                                    const parts = itemId.split(":");
                                    if (parts.length >= 3) {
                                      const encodedName =
                                        parts.length === 4
                                          ? parts[2]
                                          : parts.slice(2).join(":");
                                      const name =
                                        decodeURIComponent(encodedName);
                                      return (
                                        <li
                                          key={itemId}
                                          className="mb-1 break-inside-avoid"
                                        >
                                          {name}
                                          {subItems.length > 0 && (
                                            <ul className="list-[circle] pl-4 mt-1 text-gray-500">
                                              {subItems.map((sub, idx) => (
                                                <li key={idx}>{sub}</li>
                                              ))}
                                            </ul>
                                          )}
                                        </li>
                                      );
                                    }
                                    return null;
                                  }

                                  // Handle regular menu items
                                  const category = menuData.find(
                                    (c) => c.id === catId
                                  );
                                  const item = category?.items.find(
                                    (i) => i.id === itemId
                                  );
                                  return item ? (
                                    <li
                                      key={item.id}
                                      className="mb-1 break-inside-avoid"
                                    >
                                      {item.name}
                                      {subItems.length > 0 && (
                                        <ul className="list-[circle] pl-4 mt-1 text-gray-500">
                                          {subItems.map((sub, idx) => (
                                            <li key={idx}>{sub}</li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
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

      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesModalOpen}
        initialNotes={eventDetails.notes}
        onSave={(newNotes) => {
          setEventDetails({ ...eventDetails, notes: newNotes });
          setIsNotesModalOpen(false);
        }}
        onClose={() => setIsNotesModalOpen(false)}
      />

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
