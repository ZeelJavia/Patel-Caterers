import React from 'react';
import { Check, Square } from 'lucide-react';

const MenuCategory = ({ category, selectedItems, onToggleItem }) => {
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
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category.items.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                }`}
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
                    <h3 className={`font-medium ${isSelected ? 'text-red-900' : 'text-gray-900'}`}>
                      {item.name}
                    </h3>
                    {item.nameGujarati && (
                      <p className={`text-sm mt-1 ${isSelected ? 'text-red-700' : 'text-gray-600'}`}>
                        {item.nameGujarati}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuCategory;