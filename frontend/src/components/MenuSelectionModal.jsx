// src/components/MenuSelectionModal.jsx (With Sub-item Support)

import React, { useState, useEffect } from "react";
import MenuCategory from "./MenuCategory";
import SelectionSummary from "./SelectionSummary";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ApiService from "../services/ApiService";

const MenuSelectionModal = ({ isOpen, onClose, initialSelections, onSave }) => {
  // selectedItems structure: { categoryId: [ { id: "itemId", subItems: [] }, ... ] }
  // We need to migrate initialSelections if they are in the old format (array of strings)
  const [selectedItems, setSelectedItems] = useState({});
  const [menuData, setMenuData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Initialize and migrate selections
  useEffect(() => {
    if (initialSelections) {
      const migratedSelections = {};
      Object.keys(initialSelections).forEach((catId) => {
        const items = initialSelections[catId];
        if (Array.isArray(items)) {
          migratedSelections[catId] = items.map((item) => {
            if (typeof item === "string") {
              return { id: item, subItems: [] };
            }
            return item; // Already in new format
          });
        }
      });
      setSelectedItems(migratedSelections);
    }
  }, [initialSelections, isOpen]);

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
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
            tags: item.tags,
          });
        });

        const transformedData = Object.values(groupedData);
        setMenuData(transformedData);
        if (!activeCategory && transformedData.length > 0) {
          setActiveCategory(transformedData[0].id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchMenuData();
    }
  }, [isOpen]);

  // Fix missing names in selectedItems when menuData is loaded
  useEffect(() => {
    if (menuData.length > 0 && Object.keys(selectedItems).length > 0) {
      setSelectedItems((prev) => {
        const next = { ...prev };
        let changed = false;

        Object.keys(next).forEach((catId) => {
          next[catId] = next[catId].map((item) => {
            // If item is object, has no name, and is not custom
            if (
              typeof item === "object" &&
              !item.name &&
              item.id &&
              !item.id.startsWith("__custom__:")
            ) {
              const cat = menuData.find((c) => c.id === catId);
              const found = cat?.items.find((i) => i.id === item.id);
              if (found) {
                changed = true;
                return { ...item, name: found.name };
              }
            }
            return item;
          });
        });

        return changed ? next : prev;
      });
    }
  }, [menuData, selectedItems]); // selectedItems dependency to catch updates

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <span className="text-lg font-semibold">Loading menu items...</span>
        </div>
      </div>
    );
  }

  const toggleItemSelection = (category, itemId) => {
    setSelectedItems((prev) => {
      const categoryItems = prev[category] || [];
      const existingItemIndex = categoryItems.findIndex((i) => i.id === itemId);

      if (existingItemIndex >= 0) {
        // Remove item
        const newItems = [...categoryItems];
        newItems.splice(existingItemIndex, 1);
        return { ...prev, [category]: newItems };
      } else {
        // Add item
        let itemName = "";
        // Check if custom
        if (itemId.startsWith("__custom__:")) {
          const parts = itemId.split(":");
          if (parts.length >= 3) {
            const encodedName =
              parts.length === 4 ? parts[2] : parts.slice(2).join(":");
            itemName = decodeURIComponent(encodedName);
          }
        } else {
          // Find in menuData
          const catData = menuData.find((c) => c.id === category);
          const itemData = catData?.items.find((i) => i.id === itemId);
          itemName = itemData?.name || itemId;
        }

        return {
          ...prev,
          [category]: [
            ...categoryItems,
            { id: itemId, name: itemName, subItems: [] },
          ],
        };
      }
    });
  };

  const updateItemSubItems = (category, itemId, subItems) => {
    setSelectedItems((prev) => {
      const categoryItems = prev[category] || [];
      const existingItemIndex = categoryItems.findIndex((i) => i.id === itemId);

      if (existingItemIndex >= 0) {
        const newItems = [...categoryItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          subItems: subItems,
        };
        return { ...prev, [category]: newItems };
      }
      return prev;
    });
  };

  const moveItemUp = (categoryId, index) => {
    setSelectedItems((prev) => {
      const items = [...(prev[categoryId] || [])];
      if (index > 0) {
        [items[index - 1], items[index]] = [items[index], items[index - 1]];
        return { ...prev, [categoryId]: items };
      }
      return prev;
    });
  };

  const moveItemDown = (categoryId, index) => {
    setSelectedItems((prev) => {
      const items = [...(prev[categoryId] || [])];
      if (index < items.length - 1) {
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
        return { ...prev, [categoryId]: items };
      }
      return prev;
    });
  };

  const handleSaveAndClose = () => {
    onSave(selectedItems);
    onClose();
  };

  // --- NAVIGATION LOGIC ---
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
                  onToggleItem={(itemId) => toggleItemSelection(cat.id, itemId)}
                  onUpdateSubItems={(itemId, subItems) =>
                    updateItemSubItems(cat.id, itemId, subItems)
                  }
                />
              ))}

            {/* --- NAVIGATION BUTTONS --- */}
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
              onRemoveItem={(cat, itemId) => toggleItemSelection(cat, itemId)}
              onMoveUp={moveItemUp}
              onMoveDown={moveItemDown}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSelectionModal;
