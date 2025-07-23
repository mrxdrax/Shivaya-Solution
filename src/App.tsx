import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`${theme === 'dark' ? 'dark' : ''}`} data-theme={theme}>
        <div className="min-h-screen bg-brand-cream dark:bg-brand-dark-bg transition-colors duration-300">
          <Header />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:categorySlug" element={<Products />} />
              <Route path="/products/:categorySlug/:subcategorySlug" element={<Products />} />
              <Route path="/products/:categorySlug/:subcategorySlug/:productSlug" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;