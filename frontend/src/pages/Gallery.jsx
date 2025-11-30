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
} from "lucide-react";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or masonry

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
      size: "large", // Different sizes for variety
    },
    {
      id: 2,
      category: "food",
      title: "Authentic Gujarati Thali",
      description: "Complete traditional meal presentation",
      size: "medium",
    },
    {
      id: 3,
      category: "corporate",
      title: "Corporate Conference Lunch",
      description: "Professional catering for business event",
      size: "small",
    },
    {
      id: 4,
      category: "birthdays",
      title: "Birthday Party Setup",
      description: "Colorful birthday celebration catering",
      size: "medium",
    },
    {
      id: 5,
      category: "festivals",
      title: "Navratri Festival Catering",
      description: "Traditional festival food arrangement",
      size: "large",
    },
    {
      id: 6,
      category: "food",
      title: "Dessert Counter",
      description: "Variety of Indian sweets and desserts",
      size: "small",
    },
    {
      id: 7,
      category: "weddings",
      title: "Outdoor Wedding Buffet",
      description: "Garden wedding catering setup",
      size: "medium",
    },
    {
      id: 8,
      category: "corporate",
      title: "Business Meeting Snacks",
      description: "Professional meeting refreshments",
      size: "small",
    },
    {
      id: 9,
      category: "food",
      title: "Live Cooking Station",
      description: "Chef preparing fresh food at event",
      size: "large",
    },
    {
      id: 10,
      category: "birthdays",
      title: "Kids Party Catering",
      description: "Fun and colorful kids party setup",
      size: "medium",
    },
    {
      id: 11,
      category: "festivals",
      title: "Diwali Celebration",
      description: "Festival of lights catering service",
      size: "small",
    },
    {
      id: 12,
      category: "weddings",
      title: "Mehendi Ceremony",
      description: "Pre-wedding ceremony catering",
      size: "large",
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
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Photo Gallery Coming Soon!!!
            </h3>
            <p className="text-gray-600">
              We are currently curating our best moments to share with you. Stay
              tuned!
            </p>
          </div>

          {/* 
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredItems.slice(0, 8).map((item, index) => (
              <div
                key={item.id}
                className={`group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${getSizeClasses(
                  item.size,
                  viewMode
                )}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 group-hover:scale-110 transition-transform duration-700">
                  <div className="w-full h-full flex items-center justify-center text-amber-200 opacity-30">
                    <Camera size={64} />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="absolute top-4 right-4 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      {categories.find((cat) => cat.id === item.category)?.name}
                    </span>
                  </div>

                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/50">
                    <Sparkles className="text-white h-8 w-8" />
                  </div>
                </div>
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
          */}
        </div>
      </section>

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
