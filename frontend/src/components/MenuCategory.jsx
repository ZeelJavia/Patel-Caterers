import React, { useState } from "react";
import { Check, Square, Plus, X, Settings, Trash2, List } from "lucide-react";

const MenuCategory = ({
  category,
  selectedItems,
  onToggleItem,
  onUpdateSubItems,
}) => {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [editingSubItemsId, setEditingSubItemsId] = useState(null);
  const [newSubItemName, setNewSubItemName] = useState("");
  const [selectionTargetId, setSelectionTargetId] = useState(null); // ID of custom item we are selecting FOR

  // Generate custom item ID in the format: __custom__:{catId}:{encodedName}:{timestamp}
  const generateCustomId = (categoryId, name) => {
    const encodedName = encodeURIComponent(name.trim());
    const timestamp = Date.now();
    return `__custom__:${categoryId}:${encodedName}:${timestamp}`;
  };

  const addCustomItem = () => {
    if (customItemName.trim()) {
      const customId = generateCustomId(category.id, customItemName);
      onToggleItem(customId); // Add the custom item
      setCustomItemName("");
      setShowAddCustom(false);
    }
  };

  const isCustomItem = (itemId) => {
    return typeof itemId === "string" && itemId.startsWith("__custom__:");
  };

  const parseCustomItemName = (customId) => {
    const parts = customId.split(":");
    if (parts.length >= 3) {
      const encodedName =
        parts.length === 4 ? parts[2] : parts.slice(2).join(":");
      return decodeURIComponent(encodedName);
    }
    return customId;
  };

  // Get custom items from selectedItems
  // selectedItems is now an array of objects: [{ id: "...", subItems: [] }]
  const customItems = selectedItems
    .filter((item) => isCustomItem(item.id))
    .map((item) => ({
      id: item.id,
      name: parseCustomItemName(item.id),
      nameGujarati: "",
      isCustom: true,
      subItems: item.subItems || [],
    }));

  // Combine regular items with custom items
  // We need to make sure we don't duplicate items if they are already in category.items
  // But custom items are unique by ID, so it's fine.
  const allItems = [...category.items, ...customItems];

  const handleAddSubItem = (itemId, currentSubItems) => {
    if (newSubItemName.trim()) {
      const updatedSubItems = [...currentSubItems, newSubItemName.trim()];
      onUpdateSubItems(itemId, updatedSubItems);
      setNewSubItemName("");
    }
  };

  const handleRemoveSubItem = (itemId, currentSubItems, indexToRemove) => {
    const updatedSubItems = currentSubItems.filter(
      (_, index) => index !== indexToRemove
    );
    onUpdateSubItems(itemId, updatedSubItems);
  };

  const handleItemClick = (item) => {
    if (selectionTargetId) {
      // We are in selection mode for a specific custom group
      if (item.id === selectionTargetId) return; // Can't add self

      // Find the target custom item to get its current subItems
      const targetItem = selectedItems.find((i) => i.id === selectionTargetId);
      if (targetItem) {
        const currentSubItems = targetItem.subItems || [];
        // Check if already added?
        if (!currentSubItems.includes(item.name)) {
          const updatedSubItems = [...currentSubItems, item.name];
          onUpdateSubItems(selectionTargetId, updatedSubItems);
        }
      }
    } else {
      // Normal toggle
      onToggleItem(item.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Category Header */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
              {category.nameGujarati && (
                <p className="text-red-100 text-lg">{category.nameGujarati}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddCustom(!showAddCustom)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-lg flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Group</span>
              </button>
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Item Form */}
      {showAddCustom && (
        <div className="p-6 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              placeholder="Enter custom group name (e.g. Soup, Live Counter)"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              onKeyPress={(e) => e.key === "Enter" && addCustomItem()}
            />
            <button
              onClick={addCustomItem}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
            <button
              onClick={() => {
                setShowAddCustom(false);
                setCustomItemName("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Selection Mode Banner */}
      {selectionTargetId && (
        <div className="bg-blue-50 border-b border-blue-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center space-x-2 text-blue-800">
            <List className="w-5 h-5" />
            <span className="font-medium">Select items to add to group...</span>
          </div>
          <button
            onClick={() => setSelectionTargetId(null)}
            className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 text-sm"
          >
            Done
          </button>
        </div>
      )}

      {/* Items Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allItems.map((item) => {
            const selectedItemObj = selectedItems.find((i) => i.id === item.id);
            const isSelected = !!selectedItemObj;
            const subItems = selectedItemObj?.subItems || [];
            const isEditing = editingSubItemsId === item.id;
            const isSelectionTarget = selectionTargetId === item.id;

            // If we are in selection mode, disable interaction with the target itself
            // and maybe dim other items if they are already added?
            // For now, just keep it simple.

            return (
              <div
                key={item.id}
                className={`rounded-lg border-2 transition-all duration-200 ${
                  isSelectionTarget
                    ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                    : isSelected
                    ? "border-red-500 bg-red-50 shadow-md"
                    : "border-gray-200 hover:border-red-300 hover:bg-red-25"
                } ${
                  selectionTargetId && !isSelectionTarget
                    ? "cursor-copy hover:bg-blue-50 hover:border-blue-300"
                    : ""
                }`}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {isSelected ? (
                        <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className={`font-medium ${
                              isSelected ? "text-red-900" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                            {item.isCustom && (
                              <span className="text-xs bg-blue-100 text-blue-800 ml-2 px-2 py-1 rounded-full">
                                Custom Group
                              </span>
                            )}
                          </h3>
                          {item.nameGujarati && (
                            <p
                              className={`text-sm mt-1 ${
                                isSelected ? "text-red-700" : "text-gray-600"
                              }`}
                            >
                              {item.nameGujarati}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex space-x-1">
                            {/* Selection Mode Toggle for Custom Items */}
                            {item.isCustom && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectionTargetId(
                                    isSelectionTarget ? null : item.id
                                  );
                                }}
                                className={`p-1 rounded-full hover:bg-blue-200 ${
                                  isSelectionTarget
                                    ? "bg-blue-600 text-white"
                                    : "text-blue-500 bg-blue-100"
                                }`}
                                title="Select items from menu to add here"
                              >
                                <List className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSubItemsId(
                                  isEditing ? null : item.id
                                );
                              }}
                              className={`p-1 rounded-full hover:bg-red-200 ${
                                isEditing
                                  ? "bg-red-200 text-red-700"
                                  : "text-red-400"
                              }`}
                              title="Manage Sub-items manually"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-items Section */}
                {isSelected && (subItems.length > 0 || isEditing) && (
                  <div className="px-4 pb-4 pt-0 pl-12">
                    {subItems.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-gray-600 mb-2 space-y-1">
                        {subItems.map((sub, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between group"
                          >
                            <span>{sub}</span>
                            {isEditing && (
                              <button
                                onClick={() =>
                                  handleRemoveSubItem(item.id, subItems, idx)
                                }
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {isEditing && (
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          type="text"
                          value={newSubItemName}
                          onChange={(e) => setNewSubItemName(e.target.value)}
                          placeholder="Add sub-item manually..."
                          className="flex-1 text-sm p-1 border border-gray-300 rounded focus:ring-1 focus:ring-red-500"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSubItem(item.id, subItems);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSubItem(item.id, subItems);
                          }}
                          className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuCategory;
