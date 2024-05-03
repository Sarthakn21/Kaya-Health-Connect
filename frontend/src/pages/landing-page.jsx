import { useEffect } from "react";
import Banner from "../components/LandingPage/banner";
import Features from "../components/LandingPage/features";
import Footer from "../components/LandingPage/footer";
import Navbar from "../components/navbar";
export default function LandingPage() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="pt-[40px] px-[120px] pb-10">
        <Banner />
        <Features />
        <Footer />
      </div>
    </div>
  );
}
