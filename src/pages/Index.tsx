import type { ReactNode } from "react";
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
import Registration from "@/components/Registration";
import Footer from "@/components/Footer";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";

const Section = ({ name, children }: { name: string; children: ReactNode }) => (
  <SectionErrorBoundary name={name}>{children}</SectionErrorBoundary>
);

const Index = () => (
  <>
    <Section name="Navbar"><Navbar /></Section>
    <main>
      <Section name="Hero"><Hero /></Section>
      <Section name="Highlights"><Highlights /></Section>
      <Section name="Tours"><Tours /></Section>
      <Section name="NomadGames"><NomadGames /></Section>
      <Section name="About"><About /></Section>
      <Section name="Gallery"><Gallery /></Section>
      <Section name="Testimonials"><Testimonials /></Section>
      <Section name="Faq"><Faq /></Section>
      <Section name="CtaBand"><CtaBand /></Section>
      <Section name="Registration"><Registration /></Section>
    </main>
    <Section name="Footer"><Footer /></Section>
  </>
);

export default Index;
