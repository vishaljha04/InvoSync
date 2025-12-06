import React from "react";
import { TESTIMONIALS } from "../../utils/data";

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="relative bg-[#fbfbfb] py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-gray-700 text-lg">
            We are trusted by thousands of small businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl transition-all p-8 hover:-translate-y-1"
            >
              {/* Quote */}
              <p className="text-gray-700 text-sm leading-relaxed italic mb-6">
                "{item.quote}"
              </p>

              {/* Author Section */}
              <div className="flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-blue-950 font-semibold">{item.author}</h4>
                  <p className="text-gray-500 text-sm">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
