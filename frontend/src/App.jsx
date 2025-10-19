import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartProvider } from "./contexts/CartContext";
import Banner from "./components/Banner";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Cart from "./components/Cart";
import AboutUs6 from "./components/About";
import Contact from "./components/Contact";
import SearchResults from "./components/SearchResults";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import Wishlist from "./components/Wishlist";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import RequireAdmin from "./components/RequireAdmin";
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import BackToTop from "./components/BackToTop";
import CheckoutPage from "./pages/CheckoutPage";
import BottomNav from "./components/BottomNav";

export default function App() {
  const images = [
    "/products/product-1.jpg",
    "/products/product-2.jpg",
    "/products/product-3.jpg",
  ];

  const categories = [
    { id: 1, name: "Paintings", image: "/products/product-1.jpg", count: 3 },
    { id: 2, name: "Incense Holders", image: "/products/product-7.jpg", count: 2 },
    { id: 3, name: "Incense Boxes", image: "/products/product-4.jpg", count: 2 },
    { id: 4, name: "Pots", image: "/products/product-10.jpg", count: 1 },
    { id: 5, name: "Wall Alters", image: "/products/product-16.jpg", count: 1 },
  ];

  return (
    <ProductProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Router>
              <Navbar />
              {/* Global horizontal margin wrapper */}
              <div className="mx-4 md:mx-8 lg:mx-16">
              <Routes>
                <Route
                  path="/"
                  element={
                    <main>
                      <Banner />
                      <div className="container mx-auto px-4">
                        {/* Hero Carousel */}
                        <section className="my-8">
                          <Carousel images={images} />
                        </section>

                        {/* Categories */}
                        <section className="my-12">
                          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                            Shop by Categories
                          </h2>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 bg-gray-400 dark:bg-cyan-950 p-4 rounded-xl">
                            {categories.map((category) => (
                              <Link
                                key={category.id}
                                to={`/products?category=${category.name.toLowerCase().replace(' ', '-')}`}
                                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg p-4 transition-transform hover:scale-105"
                              >
                                <div className="relative pb-[100%] rounded-lg overflow-hidden mb-4">
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                                  />
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-semibold text-center">
                                  {category.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                                  {category.count} items
                                </p>
                              </Link>
                            ))}
                          </div>
                        </section>
                      </div>
                    </main>
                  }
                />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/about" element={<AboutUs6 />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/LoginPage" element={<LoginPage/>} />
                <Route path="/admin" element={<RequireAdmin><AdminPage/></RequireAdmin>} />
                <Route path="/checkout" element={<CheckoutPage/>} />
              </Routes>

              <BottomNav />
              </div>
              <BackToTop />
            </Router>
          </div>
        </CartProvider>
      </WishlistProvider>
    </ProductProvider>
  );
};
