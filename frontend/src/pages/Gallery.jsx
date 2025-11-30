import React, { useState } from "react";
import {
  Camera,
  Heart,
  Users,
  Calendar,
  Star,
  ChefHat,
  Utensils,
  Gift,
  Music,
  Sparkles,
  Filter,
  Grid3X3,
  List,
  X,
} from "lucide-react";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or masonry
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { id: "all", name: "All Photos", icon: Camera },
    { id: "weddings", name: "Weddings", icon: Heart },
    { id: "corporate", name: "Corporate Events", icon: Users },
    { id: "birthdays", name: "Birthday Parties", icon: Gift },
    { id: "festivals", name: "Festivals", icon: Sparkles },
    { id: "food", name: "Food Presentation", icon: ChefHat },
  ];

  // Sample gallery items with different sizes for masonry layout
  const galleryItems = [
    {
      id: 1,
      category: "weddings",
      title: "Elegant Wedding Reception",
      description: "Beautiful wedding setup with traditional decorations",
      size: "large",
      image: "/imge1.png",
    },
    {
      id: 2,
      category: "food",
      title: "Authentic Gujarati Thali",
      description: "Complete traditional meal presentation",
      size: "medium",
      image: "/imge2.png",
    },
    {
      id: 3,
      category: "corporate",
      title: "Corporate Conference Lunch",
      description: "Professional catering for business event",
      size: "small",
      image: "/imge3.png",
    },
    {
      id: 4,
      category: "birthdays",
      title: "Birthday Party Setup",
      description: "Colorful birthday celebration catering",
      size: "medium",
      image: "/imge4.png",
    },
    {
      id: 5,
      category: "festivals",
      title: "Navratri Festival Catering",
      description: "Traditional festival food arrangement",
      size: "large",
      image: "/imge5.png",
    },
    {
      id: 6,
      category: "food",
      title: "Dessert Counter",
      description: "Variety of Indian sweets and desserts",
      size: "small",
      image: "/imge6.png",
    },
    {
      id: 7,
      category: "weddings",
      title: "Outdoor Wedding Buffet",
      description: "Garden wedding catering setup",
      size: "medium",
      image: "/imge7.JPG",
    },
    {
      id: 8,
      category: "corporate",
      title: "Business Meeting Snacks",
      description: "Professional meeting refreshments",
      size: "small",
      image: "/imge8.jpg",
    },
    {
      id: 9,
      category: "food",
      title: "Live Cooking Station",
      description: "Chef preparing fresh food at event",
      size: "large",
      image: "/imge9.png",
    },
    {
      id: 10,
      category: "birthdays",
      title: "Kids Party Catering",
      description: "Fun and colorful kids party setup",
      size: "medium",
      image: "/imge10.png",
    },
    {
      id: 11,
      category: "festivals",
      title: "Diwali Celebration",
      description: "Festival of lights catering service",
      size: "small",
      image: "/imge11.jpg",
    },
    {
      id: 12,
      category: "weddings",
      title: "Mehendi Ceremony",
      description: "Pre-wedding ceremony catering",
      size: "large",
      image: "/imge12.png",
    },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const getSizeClasses = (size, viewMode) => {
    if (viewMode === "grid") {
      return "aspect-square"; // All same size in grid mode
    }
    // Masonry layout with different heights
    switch (size) {
      case "large":
        return "aspect-[4/5]"; // Taller
      case "medium":
        return "aspect-[4/3]"; // Medium
      case "small":
        return "aspect-video"; // Shorter/wider
      default:
        return "aspect-square";
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-amber-100 p-4 rounded-full">
                <Camera className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-amber-600">Gallery</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take a glimpse into our world of culinary artistry and event
              excellence. From intimate gatherings to grand celebrations, see
              how we bring your vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "900+", label: "Events Catered" },
              { number: "700+", label: "Happy Clients" },
              { number: "15+", label: "Years Experience" },
              { number: "10+", label: "Team Members" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${getSizeClasses(
                  item.size,
                  viewMode
                )}`}
                onClick={() => setSelectedImage(item)}
              >
                <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No photos found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category to view more photos.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-amber-500 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage.image}
            alt={selectedImage.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Star className="h-16 w-16 text-amber-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Create Your Own Memorable Event?
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              Let us bring the same level of excellence and beauty to your next
              celebration
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-amber-50 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Book Your Event</span>
            </a>
            <a
              href="tel:+919173108101"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>Call: +91 91731 08101</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
