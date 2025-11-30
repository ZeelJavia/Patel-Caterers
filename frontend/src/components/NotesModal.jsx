import React, { useState } from "react";
import { Save, X, FileText } from "lucide-react";

const NotesModal = ({ isOpen, onClose, initialNotes, onSave }) => {
  const [notes, setNotes] = useState(initialNotes || "");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  const handleCancel = () => {
    setNotes(initialNotes || "");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Event Notes</h2>
              <p className="text-sm text-gray-600">
                Add notes that will appear in your PDFs
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes here...&#10;&#10;Tips:&#10;• Each line will become a bullet point in PDFs&#10;• Use clear, concise statements&#10;• Include important instructions or requirements"
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                style={{ fontFamily: "monospace" }}
              />
              <p className="mt-2 text-xs text-gray-500">
                Each line will appear as a bullet point in your PDF documents
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                💡 Tips for effective notes:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Keep each point on a separate line</li>
                <li>• Use clear, actionable language</li>
                <li>• Include special dietary requirements</li>
                <li>• Mention setup or timing requirements</li>
                <li>• Add contact information if needed</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
