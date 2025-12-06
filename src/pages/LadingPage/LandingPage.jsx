import React from "react";
import Headers from "../../components/landing/Headers";
import Hero from "../../components/landing/Hero";
import Feature from "../../components/landing/Feature";
import Testimonials from "../../components/landing/Testimonials";
import Faqs from "../../components/landing/Faqs";

const LandingPage = () => {
  return (
    <div className="bg-[#ffffff] text-gray-600 ">
      <Headers />
      <main>
        <Hero />
        <Feature/>
        <Testimonials/>
        <Faqs/>
      </main>
    </div>
  );
};

export default LandingPage;
