import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { FaHeart } from 'react-icons/fa';
import Carousel from './Carousel';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Products
        </button>
      </div>
    );
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Product Images */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <Carousel images={product.images} autoplayInterval={4000} />
          </div>
          {/* Thumbnail Navigation */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                className="relative rounded-lg overflow-hidden aspect-square bg-white dark:bg-gray-800"
                onClick={() => {/* TODO: Implement thumbnail click */}}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <button
                onClick={toggleWishlist}
                className={`p-2 rounded-full ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                } hover:scale-110 transition-all duration-200`}
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FaHeart size={20} />
              </button>
            </div>
            {product.isNew && (
              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                New
              </span>
            )}
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
              ${product.price}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Category */}
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Category:
              </span>
              <span className="ml-2 text-gray-900 dark:text-white capitalize">
                {product.category.replace('-', ' ')}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-20 h-10 text-center rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Buy Now - ${(product.price * quantity).toFixed(2)}
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Materials</h3>
                <p className="mt-1 text-gray-900 dark:text-white">Handcrafted bamboo, natural dyes</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dimensions</h3>
                <p className="mt-1 text-gray-900 dark:text-white">Height: 12 inches, Width: 8 inches</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Care Instructions</h3>
                <p className="mt-1 text-gray-900 dark:text-white">Clean with dry cloth, avoid direct sunlight</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}