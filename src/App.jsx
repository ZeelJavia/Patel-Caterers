import React, { useState } from 'react';
import { ChefHat, Download, Plus, Minus, FileText } from 'lucide-react';
import MenuCategory from './components/MenuCategory';
import SelectionSummary from './components/SelectionSummary';
import { menuData } from './data/menuData';

function App() {
  const [selectedItems, setSelectedItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('snacks');

  const toggleItemSelection = (category, item) => {
    setSelectedItems(prev => {
      const categoryItems = prev[category] || [];
      const isSelected = categoryItems.includes(item);
      
      if (isSelected) {
        return {
          ...prev,
          [category]: categoryItems.filter(i => i !== item)
        };
      } else {
        return {
          ...prev,
          [category]: [...categoryItems, item]
        };
      }
    });
  };

  const getTotalSelectedItems = () => {
    return Object.values(selectedItems).reduce((total, items) => total + items.length, 0);
  };

  const handleGeneratePDF = () => {
    // This would integrate with your backend PDF generation
    console.log('Generating PDF with selections:', selectedItems);
    // In a real app, this would call your backend API
    alert('PDF generation would be implemented with backend integration');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">The Grand</h1>
                <p className="text-sm text-blue-600 font-medium">પટેલ કેટરર્સ</p>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <nav className="space-y-2">
                {menuData.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      {selectedItems[category.id] && selectedItems[category.id].length > 0 && (
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
                .filter(category => category.id === activeCategory)
                .map(category => (
                  <MenuCategory
                    key={category.id}
                    category={category}
                    selectedItems={selectedItems[category.id] || []}
                    onToggleItem={(item) => toggleItemSelection(category.id, item)}
                  />
                ))}

              {/* Selection Summary */}
              <SelectionSummary
                selectedItems={selectedItems}
                menuData={menuData}
                onRemoveItem={(category, item) => toggleItemSelection(category, item)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;