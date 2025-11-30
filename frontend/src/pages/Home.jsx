import React from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChefHat,
  Award,
  Heart,
  Utensils,
  Clock,
  CheckCircle,
} from "lucide-react";
import mainLogo from "../assets/main-logo.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="mb-8">
              <img
                src={mainLogo}
                alt="Patel Caterers"
                className="h-21 w-21 mx-auto mb-6 rounded-xl shadow-2xl p-2 bg-white border-4 border-white border-opacity-20"
              />
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Patel Caterers
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Creating Unforgettable Culinary Experiences for Over 15 Years
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                From intimate family gatherings to grand celebrations, we bring
                authentic flavors and exceptional service to every event in
                Junagadh and beyond.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/contact"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Get Quote Now
              </Link>
              <Link
                to="/gallery"
                className="bg-white bg-opacity-10 backdrop-blur-sm border-2 border-white border-opacity-30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-opacity-20 transition-all duration-200"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Catering Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in creating memorable dining experiences for all
              types of events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Wedding Catering",
                desc: "Make your special day unforgettable with our wedding catering services",
              },
              {
                icon: Users,
                title: "Corporate Events",
                desc: "Professional catering for business meetings, conferences, and corporate parties",
              },
              {
                icon: Calendar,
                title: "Birthday Parties",
                desc: "Celebrate with delicious food that makes birthdays extra special",
              },
              {
                icon: Utensils,
                title: "Festival Catering",
                desc: "Traditional and authentic flavors for cultural and religious festivals",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                  <service.icon className="h-8 w-8 text-amber-600 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Why Choose Patel Caterers?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Award,
                    title: "15+ Years Experience",
                    desc: "Over a decade and a half of excellence in catering services",
                  },
                  {
                    icon: ChefHat,
                    title: "Expert Chefs",
                    desc: "Skilled culinary professionals creating authentic flavors",
                  },
                  {
                    icon: CheckCircle,
                    title: "Quality Ingredients",
                    desc: "Fresh, high-quality ingredients in every dish",
                  },
                  {
                    icon: Clock,
                    title: "Timely Service",
                    desc: "Punctual delivery and setup for your events",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-amber-100 rounded-full p-3 flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8">
              <div className="text-center">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Get Your Quote Today
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Ready to make your event special? Contact us for a
                    personalized catering quote.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3 text-gray-700">
                      <Phone className="h-5 w-5 text-amber-600" />
                      <span>+91 91731 08101</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 text-gray-700">
                      <Phone className="h-5 w-5 text-amber-600" />
                      <span>+91 98257 27140</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 text-gray-700">
                      <MapPin className="h-5 w-5 text-amber-600" />
                      <span>Junagadh, Gujarat</span>
                    </div>
                  </div>

                  <Link
                    to="/contact"
                    className="mt-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-200 inline-block"
                  >
                    Contact Us Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "900+", label: "Events Catered" },
              { number: "15+", label: "Years Experience" },
              { number: "300+", label: "Menu Items" },
              { number: "100%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Create Your Perfect Event?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let us handle the catering while you enjoy your special moments. Our
            team is ready to make your event unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-amber-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Request Quote
            </Link>
            <Link
              to="/gallery"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-amber-600 transition-all duration-200"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
