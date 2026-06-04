import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedListings from '@/components/home/FeaturedListings';
import ClassicsSection from '@/components/home/ClassicsSection';
import PremiumVault from '@/components/home/PremiumVault';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Newsletter from '@/components/home/Newsletter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow" aria-label="Main content">
        <Hero />
        <CategoryGrid />
        <FeaturedListings />
        <ClassicsSection />
        <PremiumVault />
        <WhyChooseUs />
        <Newsletter />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
