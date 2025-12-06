import React from "react";
import { FEATURE } from "../../utils/data";
import { ArrowRight } from "lucide-react";

const Feature = () => {
  return (
    <section
      id="feature"
      className="relative bg-[#fbfbfb] py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 mb-6">
            Smart Features Built for You
          </h2>
          <p className="text-gray-700 text-lg">
            Powerful AI tools to simplify your invoicing, automate reminders,
            and give you insights—all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURE.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl transition-all p-8 hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-200 text-blue-950 mb-6 group-hover:scale-110 transition">
                <item.icon size={28} />
              </div>

              <h3 className="text-xl font-bold text-blue-950 mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
              <a
                href="#"
                className="inline-flex items-center text-blue-900 font-medium border p-1 rounded-2xl text-xs mt-2 px-2 hover:bg-gray-400 hover:text-white"
              >
                Learn More <ArrowRight className="w-4 h-5 ml-2"/>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
