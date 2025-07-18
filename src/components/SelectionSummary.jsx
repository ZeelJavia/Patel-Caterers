import React from 'react';
import { X, FileText, ChefHat } from 'lucide-react';

const SelectionSummary = ({ selectedItems, menuData, onRemoveItem }) => {
  const hasSelections = Object.values(selectedItems).some(items => items.length > 0);

  if (!hasSelections) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No items selected yet</h3>
        <p className="text-gray-600">Choose items from the categories above to build your custom menu</p>
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
                {categorySelections.map((itemId) => {
                  const item = category.items.find(i => i.id === itemId);
                  if (!item) return null;

                  return (
                    <div
                      key={itemId}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.nameGujarati && (
                          <p className="text-sm text-gray-600">{item.nameGujarati}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(category.id, itemId)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
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
          <strong>Ready to generate your custom menu?</strong> Click the "Generate PDF" button in the header to create your personalized menu document.
        </p>
      </div>
    </div>
  );
};

export default SelectionSummary;