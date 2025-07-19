// src/components/MenuSelectionModal.jsx (With Category Navigation)

import React, { useState } from "react";
import { menuData } from "../data/menuData";
import MenuCategory from "./MenuCategory";
import SelectionSummary from "./SelectionSummary";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Import navigation icons

const MenuSelectionModal = ({ isOpen, onClose, initialSelections, onSave }) => {
  const [selectedItems, setSelectedItems] = useState(initialSelections);
  const [activeCategory, setActiveCategory] = useState(menuData[0]?.id || "");

  if (!isOpen) return null;

  const toggleItemSelection = (category, item) => {
    setSelectedItems((prev) => {
      const categoryItems = prev[category] || [];
      const isSelected = categoryItems.includes(item);
      return isSelected
        ? { ...prev, [category]: categoryItems.filter((i) => i !== item) }
        : { ...prev, [category]: [...categoryItems, item] };
    });
  };

  const handleSaveAndClose = () => {
    onSave(selectedItems);
    onClose();
  };

  // --- NAVIGATION LOGIC (NOW LIVES IN THE MODAL) ---
  const activeCategoryIndex = menuData.findIndex(
    (cat) => cat.id === activeCategory
  );

  const handlePreviousCategory = () => {
    if (activeCategoryIndex > 0) {
      setActiveCategory(menuData[activeCategoryIndex - 1].id);
    }
  };

  const handleNextCategory = () => {
    if (activeCategoryIndex < menuData.length - 1) {
      setActiveCategory(menuData[activeCategoryIndex + 1].id);
    }
  };
  // --- END OF NAVIGATION LOGIC ---

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold">Select Menu Items</h2>
          <div className="space-x-4">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Save Menu
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
          {/* Category Sidebar */}
          <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <nav className="space-y-2">
              {menuData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === category.id
                      ? "bg-red-500 text-white shadow"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
          {/* Main Content Area */}
          <div className="lg:col-span-3 overflow-y-auto space-y-6 p-2 pr-4">
            {menuData
              .filter((cat) => cat.id === activeCategory)
              .map((cat) => (
                <MenuCategory
                  key={cat.id}
                  category={cat}
                  selectedItems={selectedItems[cat.id] || []}
                  onToggleItem={(item) => toggleItemSelection(cat.id, item)}
                />
              ))}

            {/* --- NAVIGATION BUTTONS (NOW LIVE IN THE MODAL) --- */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handlePreviousCategory}
                disabled={activeCategoryIndex === 0}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 disabled:opacity-50"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>
              <span className="text-gray-600 font-medium">
                Category {activeCategoryIndex + 1} of {menuData.length}
              </span>
              <button
                onClick={handleNextCategory}
                disabled={activeCategoryIndex === menuData.length - 1}
                className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 disabled:bg-red-400"
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <SelectionSummary
              selectedItems={selectedItems}
              menuData={menuData}
              onRemoveItem={(cat, item) => toggleItemSelection(cat, item)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSelectionModal;
