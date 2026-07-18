import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import RobotLanding from '@/components/RobotLanding';
import ProcessTimelineSection from '@/components/ProcessTimelineSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <RobotLanding />
      <Hero />
      <Services />
      <ProcessTimelineSection />
      <Projects />
      <About />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
