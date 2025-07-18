// App.jsx

import React, { useState } from "react";
// --- 1. IMPORT NEW ICONS ---
import {
  ChefHat,
  Download,
  FileText,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import MenuCategory from "./components/MenuCategory";
import SelectionSummary from "./components/SelectionSummary";
import { menuData } from "./data/menuData";

function App() {
  const [selectedItems, setSelectedItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(menuData[0]?.id || ""); // Set initial state safely

  const toggleItemSelection = (category, item) => {
    setSelectedItems((prev) => {
      const categoryItems = prev[category] || [];
      const isSelected = categoryItems.includes(item);

      if (isSelected) {
        return {
          ...prev,
          [category]: categoryItems.filter((i) => i !== item),
        };
      } else {
        return {
          ...prev,
          [category]: [...categoryItems, item],
        };
      }
    });
  };

  const getTotalSelectedItems = () => {
    return Object.values(selectedItems).reduce(
      (total, items) => total + items.length,
      0
    );
  };

  const handleGeneratePDF = async () => {
    console.log("Sending selections to backend:", selectedItems);

    const finalSelections = Object.keys(selectedItems).reduce((acc, key) => {
      if (selectedItems[key].length > 0) {
        acc[key] = selectedItems[key];
      }
      return acc;
    }, {});

    if (Object.keys(finalSelections).length === 0) {
      alert("Please select at least one item before generating a PDF.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalSelections),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "The-Grand-Custom-Menu.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Failed to generate PDF. Please ensure the backend server is running."
      );
    }
  };

  // --- 2. ADD NAVIGATION LOGIC ---
  const activeCategoryIndex = menuData.findIndex(
    (cat) => cat.id === activeCategory
  );

  const handlePreviousCategory = () => {
    if (activeCategoryIndex > 0) {
      const prevCategory = menuData[activeCategoryIndex - 1];
      setActiveCategory(prevCategory.id);
    }
  };

  const handleNextCategory = () => {
    if (activeCategoryIndex < menuData.length - 1) {
      const nextCategory = menuData[activeCategoryIndex + 1];
      setActiveCategory(nextCategory.id);
    }
  };
  // --- END OF NEW LOGIC ---

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* <ChefHat className="h-8 w-8 text-red-600" /> */}
              <div>
                <img src="/logo.jpg" alt="The Grand - Patel Caters" style={{ height: '40px' }} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 px-3 py-1 rounded-full">
                <span className="text-red-800 font-medium">
                  {getTotalSelectedItems()} items selected
                </span>
              </div>
              <button
                onClick={handleGeneratePDF}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Generate PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h2>
              <nav className="space-y-2">
                {menuData.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? "bg-red-600 text-white shadow"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      {selectedItems[category.id] &&
                        selectedItems[category.id].length > 0 && (
                          <span className="bg-white text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                            {selectedItems[category.id].length}
                          </span>
                        )}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Active Category */}
              {menuData
                .filter((category) => category.id === activeCategory)
                .map((category) => (
                  <MenuCategory
                    key={category.id}
                    category={category}
                    selectedItems={selectedItems[category.id] || []}
                    onToggleItem={(item) =>
                      toggleItemSelection(category.id, item)
                    }
                  />
                ))}

              {/* --- 3. ADD NAVIGATION BUTTONS UI --- */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePreviousCategory}
                  disabled={activeCategoryIndex === 0}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
              {/* --- END OF NEW UI --- */}

              {/* Selection Summary */}
              <SelectionSummary
                selectedItems={selectedItems}
                menuData={menuData}
                onRemoveItem={(category, item) =>
                  toggleItemSelection(category, item)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
