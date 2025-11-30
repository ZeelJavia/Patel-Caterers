import React from "react";
import { Users, Award, Clock, Heart, Star, CheckCircle } from "lucide-react";
import mainLogo from "../assets/main-logo.png";

const About = () => {
  const stats = [
    { label: "Years of Experience", value: "15+" },
    { label: "Events Catered", value: "900+" },
    { label: "Happy Clients", value: "700+" },
    { label: "Team Members", value: "10+" },
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-amber-600" />,
      title: "Passion for Food",
      description:
        "We believe in creating culinary experiences that touch hearts and create lasting memories.",
    },
    {
      icon: <Star className="h-8 w-8 text-amber-600" />,
      title: "Quality Excellence",
      description:
        "Using only the finest ingredients and traditional cooking methods to ensure exceptional taste.",
    },
    {
      icon: <Users className="h-8 w-8 text-amber-600" />,
      title: "Customer First",
      description:
        "Your satisfaction is our priority. We work closely with you to make your vision come to life.",
    },
    {
      icon: <Award className="h-8 w-8 text-amber-600" />,
      title: "Professional Service",
      description:
        "Trained staff, timely delivery, and attention to every detail for a seamless catering experience.",
    },
  ];

  const milestones = [
    {
      year: "2009",
      title: "The Beginning",
      description:
        "Started as a small family business with a passion for authentic Indian cuisine.",
    },
    {
      year: "2012",
      title: "Expansion",
      description:
        "Expanded our services to cover all types of events across Junagadh and surrounding areas.",
    },
    {
      year: "2015",
      title: "Recognition",
      description:
        "Became the preferred caterer for major corporate events and wedding celebrations.",
    },
    {
      year: "2020",
      title: "Innovation",
      description:
        "Introduced modern presentation styles while maintaining traditional flavors.",
    },
    {
      year: "2025",
      title: "Digital Excellence",
      description:
        "Launched our digital platform to serve customers better with enhanced menu planning.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img
                src={mainLogo}
                alt="Patel Caterers"
                className="h-25 w-24 rounded-xl shadow-lg p-2 bg-white border-2 border-gray-200"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-amber-600">Patel Caterers</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              For over a decade and a half, we have been crafting exceptional
              culinary experiences that bring people together. From intimate
              family gatherings to grand celebrations, our passion for authentic
              flavors and professional service has made us Junagadh's most
              trusted catering partner.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  What started as a small family kitchen in 2009 has grown into
                  Junagadh's most trusted catering service. Founded by the Patel
                  family with a simple mission: to share the authentic flavors
                  of Gujarat with every celebration.
                </p>
                <p>
                  Over the years, we've had the honor of being part of thousands
                  of special moments - from intimate birthday parties to grand
                  wedding celebrations, corporate events to religious festivals.
                  Each event has taught us something new and strengthened our
                  commitment to excellence.
                </p>
                <p>
                  Today, with a team of 10+ dedicated professionals, we continue
                  to uphold the same values that started our journey: quality
                  ingredients, traditional recipes, and heartfelt service that
                  makes every occasion truly memorable.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-amber-100 rounded-2xl p-8 transform rotate-3">
                <div className="bg-white rounded-xl p-6 transform -rotate-3 shadow-lg">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      15+ Years of Excellence
                    </h3>
                    <p className="text-gray-600">
                      Serving authentic flavors with passion and dedication
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do and define who we are
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones that have shaped our story over the years
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-amber-200"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-amber-600 rounded-full border-4 border-white shadow-lg"></div>

                  {/* Content */}
                  <div
                    className={`ml-20 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-amber-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Patel Caterers?
            </h2>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Here's what sets us apart from other catering services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Expert chefs with 15+ years experience",
              "Fresh ingredients sourced daily",
              "Customizable menus for all dietary needs",
              "Professional service staff",
              "Competitive and transparent pricing",
              "Complete event management support",
              "Hygiene and quality certified",
              "On-time delivery guarantee",
              "24/7 customer support",
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-amber-200 flex-shrink-0" />
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Make Your Event Special?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's discuss how we can make your next celebration unforgettable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Contact Us Today
            </a>
            <a
              href="tel:+919173108101"
              className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-colors"
            >
              Call Now: +91 91731 08101
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
