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
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

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

                        {/* Newsletter Subscription */}
                        <section className="my-12 bg-blue-600 dark:bg-blue-700 rounded-xl p-8 text-center">
                          <h2 className="text-2xl font-bold text-white mb-4">
                            Subscribe to Our Newsletter
                          </h2>
                          <p className="text-blue-100 mb-6">
                            Stay updated with our latest products and special offers
                          </p>
                          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                            <input
                              type="email"
                              placeholder="Enter your email"
                              className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                              type="submit"
                              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                            >
                              Subscribe
                            </button>
                          </form>
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
              </Routes>

              {/* Footer */}
              <footer className="bg-gray-900 text-white mt-16">
                <div className="container mx-auto px-4 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4">MAYUR HAMSA</h3>
                      <p className="text-gray-400">
                        Your one-stop shop for handmade and unique products. We offer a wide range of items
                        including paintings, incense boxes, and more.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                      <ul className="space-y-2">
                        <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                        <li><a href="/products" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
                        <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                        <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                      <ul className="space-y-2">
                        <li className="text-gray-400">
                          <a href="mailto:info@mayurhamsa.com" className="hover:text-white transition-colors">
                            info@mayurhamsa.com
                          </a>
                        </li>
                        <li className="text-gray-400">
                          <a href="tel:+1231231234" className="hover:text-white transition-colors">
                            +123 123 1234
                          </a>
                        </li>
                        <li className="text-gray-400">
                          123 Main Street, Anytown, India
                        </li>
                      </ul>
                      <div>
                        <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                          <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FaFacebook size={24} /> </a>
                          <a href="https://www.instagram.com/mayurhamsa/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FaInstagram size={24} /> </a>
                          <a href="https://twitter.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={24} /> </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    © {new Date().getFullYear()} MAYUR HAMSA. All rights reserved.
                  </div>
                </div>
              </footer>
            </Router>
          </div>
        </CartProvider>
      </WishlistProvider>
    </ProductProvider>
  );
};
