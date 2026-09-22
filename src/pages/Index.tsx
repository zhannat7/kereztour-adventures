import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import Tours from "@/components/Tours";
import NomadGames from "@/components/NomadGames";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Highlights />
      <Tours />
      <NomadGames />
      <About />
      <Gallery />
      <Testimonials />
      <Faq />
      <CtaBand />
    </main>
    <Footer />
  </>
);

export default Index;
