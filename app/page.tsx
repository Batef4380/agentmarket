import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import FeaturedAgents from "@/components/landing/FeaturedAgents";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-cream">
      <Navbar />
      <Hero />
      <About />
      <FeaturedAgents />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
