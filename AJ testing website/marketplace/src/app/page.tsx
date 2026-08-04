import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import FeaturedTemplates from '@/components/home/FeaturedTemplates';
import Categories from '@/components/home/Categories';
import BundleOffer from '@/components/home/BundleOffer';
import Testimonials from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Hero />
        <Stats />
        <Categories />
        <FeaturedTemplates />
        <BundleOffer />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
