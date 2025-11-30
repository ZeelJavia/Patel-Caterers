import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import mainLogo from "../assets/main-logo.png";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src={mainLogo}
                alt="Patel Caterers"
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Patel Caterers
                </h3>
                <p className="text-gray-400">Professional Catering Services</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Creating unforgettable culinary experiences for over 15 years.
              From intimate gatherings to grand celebrations, we bring authentic
              flavors and exceptional service to every event.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-amber-600 p-3 rounded-full hover:bg-amber-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/patelcaterers.jnd/"
                className="bg-amber-600 p-3 rounded-full hover:bg-amber-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-amber-600 p-3 rounded-full hover:bg-amber-700 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Gallery", href: "/gallery" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-gray-300">+91 91731 08101</p>
                  <p className="text-gray-300">+91 98257 27140</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-400 mt-1" />
                <div>
                  <p className="text-gray-300">Junagadh, Gujarat</p>
                  <p className="text-gray-300">India</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-gray-300">Mon - Sun</p>
                  <p className="text-gray-300">9:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Patel Caterers. All rights reserved. Professional Catering
              Services in Junagadh.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
