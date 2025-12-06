import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-blue-950 text-white py-16 mt-20 overflow-hidden">
      {/* Dark gradient grid background */}
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:60px_60px] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pb-10 border-b border-white/20">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold">Invosync</h2>
            <p className="text-gray-300 mt-3 text-sm leading-relaxed">
              AI-powered invoicing made simple. Generate invoices, send reminders,
              and get insights — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <Link to="/features" className="hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition">
                  FAQs
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex items-center space-x-5">
              <a
                href="#"
                className="p-2 rounded-lg border border-white/30 text-white hover:bg-white hover:text-blue-950 transition"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-white/30 text-white hover:bg-white hover:text-blue-950 transition"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-white/30 text-white hover:bg-white hover:text-blue-950 transition"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg border border-white/30 text-white hover:bg-white hover:text-blue-950 transition"
              >
                <FileText size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-gray-300 text-sm">
          <p>© {new Date().getFullYear()} Invosync. All rights reserved.</p>
          <div className="space-x-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
