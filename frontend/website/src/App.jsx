import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Banner from "./components/Banner";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import ProductCard from "./components/Card";
import Cart from "./components/Cart";
import AboutUs6 from "./components/About";

export default function App() {
  const images = [
    "/banner-2.jpg",
    "/banner-2.jpg",
    "/banner-2.jpg",
  ];

  const bestSellingProducts = [
    {
      id: 1,
      name: "Handmade Paintings",
      description: "Beautiful handmade paintings by ParamShantim Das.",
      price: 300,
      images: ["product-1.jpg", "product-1.jpg", "product-1.jpg"],
    },
    {
      id: 2,
      name: "Golden Inscense Box",
      description: "Antique handmade inscense box made out of bamboo.",
      price: 150,
      images: ["product-1.jpg", "product-1.jpg", "product-1.jpg"],
    },
    {
      id: 3,
      name: "Peacock Inscense Holder",
      description: "Unqiue handmade bamboo inscense holder with a peacock design.",
      price: 200,
      images: ["product-1.jpg", "product-1.jpg", "product-1.jpg"],
    },
    {
      id: 4,
      name: "Hummingbird Pot",
      description: "A simple pot made out of bamboo handmade.",
      price: 250,
      images: ["product-1.jpg", "product-1.jpg", "product-1.jpg"],
    },
  ];

  const categories = [
    {id: 1, name: "Paintings", image: "/product-1.jpg"},
    {id: 2, name: "Inscense Holders", image: "/product-1.jpg"},
    {id: 3, name: "Inscense Boxes", image: "/product-1.jpg"},
    {id: 4, name: "Pots", image: "/product-1.jpg"},
    {id: 5, name: "Wall Alters", image: "/product-1.jpg"},
  ]

  return (
    <>
      <Router>
        <Banner />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Carousel images={images} />
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-center mb-8">Our Best Selling Products</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bestSellingProducts.map((product) => (
                      <ProductCard key={product.id} product={product}/>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  <h2 className="text-3xl font-bold text-center mb-8">Shop by Categories</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                    {categories.map((category) => (
                      <div key={category.id} className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover"/>
                        </div>
                        <p className="text-center mt-4 font-semibold">{category.id}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<AboutUs6/>} />
        </Routes>
      </Router>
    </>
  );
};
