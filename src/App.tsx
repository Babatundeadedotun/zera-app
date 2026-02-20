import { useState } from 'react';

import Navigation from '@/components/Navigation';
import ProductDetailModal from '@/components/ProductDetailModal';
import SearchModal from '@/components/SearchModal';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

import HeroSection from '@/sections/HeroSection';
import CategoriesSection from '@/sections/CategoriesSection';
import ProductsSection from '@/sections/ProductsSection';
import ContactSection from '@/sections/ContactSection';

import type { Product, Category } from '@/types';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleCategoryClick = (_category: Category) => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchProductClick = (product: Product) => {
    handleViewDetails(product);
    setIsSearchOpen(false);
  };

  return (
    <div className="relative bg-cream min-h-screen">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navigation
        onSearchClick={() => setIsSearchOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Main Content - No gaps, flows directly */}
      <main className="relative w-full" style={{ marginTop: 0, paddingTop: 0 }}>
        {/* Hero Section - Compact, no full height */}
        <HeroSection />

        {/* Categories Section - Flows immediately after hero */}
        <CategoriesSection onCategoryClick={handleCategoryClick} />

        {/* Products Section */}
        <ProductsSection onViewDetails={handleViewDetails} />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onProductClick={handleSearchProductClick}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}

export default App;
