import { lazy, Suspense, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import Tours from "@/components/Tours";
import Footer from "@/components/Footer";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";

// Below-the-fold sections load as separate chunks so the first paint only needs the top of the page.
const NomadGames = lazy(() => import("@/components/NomadGames"));
const About = lazy(() => import("@/components/About"));
const Gallery = lazy(() => import("@/components/Gallery"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Faq = lazy(() => import("@/components/Faq"));
const CtaBand = lazy(() => import("@/components/CtaBand"));
const Registration = lazy(() => import("@/components/Registration"));

const Section = ({ name, children }: { name: string; children: ReactNode }) => (
  <SectionErrorBoundary name={name}>{children}</SectionErrorBoundary>
);

const LazySection = ({ name, children }: { name: string; children: ReactNode }) => (
  <SectionErrorBoundary name={name}>
    <Suspense fallback={<div className="min-h-[50vh]" aria-hidden="true" />}>{children}</Suspense>
  </SectionErrorBoundary>
);

const Index = () => (
  <>
    <Section name="Navbar"><Navbar /></Section>
    <main>
      <Section name="Hero"><Hero /></Section>
      <Section name="Highlights"><Highlights /></Section>
      <Section name="Tours"><Tours /></Section>
      <LazySection name="NomadGames"><NomadGames /></LazySection>
      <LazySection name="About"><About /></LazySection>
      <LazySection name="Gallery"><Gallery /></LazySection>
      <LazySection name="Testimonials"><Testimonials /></LazySection>
      <LazySection name="Faq"><Faq /></LazySection>
      <LazySection name="CtaBand"><CtaBand /></LazySection>
      <LazySection name="Registration"><Registration /></LazySection>
    </main>
    <Section name="Footer"><Footer /></Section>
  </>
);

export default Index;
