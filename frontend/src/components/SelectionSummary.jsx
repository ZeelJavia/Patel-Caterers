import React from "react";
import { X, FileText, ChefHat, ChevronUp, ChevronDown } from "lucide-react";

const SelectionSummary = ({
  selectedItems,
  menuData,
  onRemoveItem,
  onMoveUp,
  onMoveDown,
}) => {
  const hasSelections = Object.values(selectedItems).some(
    (items) => items.length > 0
  );

  if (!hasSelections) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No items selected yet
        </h3>
        <p className="text-gray-600">
          Choose items from the categories above to build your custom menu
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-red-600" />
        <h3 className="text-xl font-semibold text-gray-900">Selected Items</h3>
      </div>

      <div className="space-y-6">
        {menuData.map((category) => {
          const categorySelections = selectedItems[category.id] || [];
          if (categorySelections.length === 0) return null;

          return (
            <div key={category.id} className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-3">
                {category.name} ({categorySelections.length} items)
              </h4>
              <div className="space-y-2">
                {categorySelections.map((selectedItem, index) => {
                  // Handle both string (legacy) and object format
                  const itemId =
                    typeof selectedItem === "string"
                      ? selectedItem
                      : selectedItem.id;
                  const subItems =
                    typeof selectedItem === "object"
                      ? selectedItem.subItems || []
                      : [];

                  let item = category.items.find((i) => i.id === itemId);

                  // If not found in category items, check if it's a custom item
                  if (!item && itemId.startsWith("__custom__:")) {
                    const parts = itemId.split(":");
                    if (parts.length >= 3) {
                      const encodedName =
                        parts.length === 4
                          ? parts[2]
                          : parts.slice(2).join(":");
                      item = {
                        id: itemId,
                        name: decodeURIComponent(encodedName),
                        nameGujarati: "",
                      };
                    }
                  }

                  if (!item) return null;

                  return (
                    <div key={itemId} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex flex-col mr-3 space-y-1">
                            <button
                              onClick={() => onMoveUp(category.id, index)}
                              disabled={index === 0}
                              className={`p-0.5 rounded ${
                                index === 0
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                              }`}
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onMoveDown(category.id, index)}
                              disabled={index === categorySelections.length - 1}
                              className={`p-0.5 rounded ${
                                index === categorySelections.length - 1
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                              }`}
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            {item.nameGujarati && (
                              <p className="text-sm text-gray-600">
                                {item.nameGujarati}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(category.id, itemId)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {subItems.length > 0 && (
                        <ul className="mt-2 ml-11 list-disc list-inside text-sm text-gray-600">
                          {subItems.map((sub, idx) => (
                            <li key={idx}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-red-50 rounded-lg">
        <p className="text-sm text-red-800">
          <strong>Ready to generate your custom menu?</strong> Click the
          "Generate PDF" button in the header to create your personalized menu
          document.
        </p>
      </div>
    </div>
  );
};

export default SelectionSummary;
