import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaStar, FaStarHalf } from "react-icons/fa";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

const ProductCard = ({product}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        let interval;
        if(isHovered) {
            interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isHovered, product.images.length]);

    const handleWishlistToggle = (e) => {
        e.preventDefault(); // Prevent card navigation
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    const isWishlisted = isInWishlist(product.id);

    const renderRating = (rating = 4.5) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        return (
            <div className="flex items-center gap-1">
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
                ))}
                {hasHalfStar && <FaStarHalf className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />}
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">({rating})</span>
            </div>
        );
    };

    return (
        <Link to={`/product/${product.id}`} className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div 
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image container with wishlist button */}
                <div className="relative w-full pt-[100%]">
                    <img 
                        src={product.images[currentImageIndex]} 
                        alt={product.name} 
                        className="absolute top-0 left-0 w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-2 right-2 p-1.5 rounded-full ${
                            isWishlisted 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400'
                        } hover:scale-110 transition-all duration-200`}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <FaHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    {product.isNew && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 text-xs font-medium rounded-full">
                            New
                        </span>
                    )}
                </div>
                
                <div className="p-2 sm:p-3 flex flex-col flex-grow">
                    {/* Product Title */}
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">{product.name}</h3>
                    
                    {/* Rating */}
                    <div className="mb-2">
                        {renderRating(product.rating)}
                    </div>

                    <div className="mt-auto">
                        {/* Price */}
                        <p className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400 mb-2">${product.price}</p>
                        
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            <Link 
                                to={`/product/${product.id}`}
                                className="h-8 sm:h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-center rounded transition-colors duration-200 text-xs sm:text-sm font-medium"
                            >
                                Buy Now
                            </Link>
                            <button 
                                className="h-8 sm:h-9 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 text-gray-800 dark:text-white rounded transition-colors duration-200 text-xs sm:text-sm font-medium"
                                onClick={handleAddToCart}
                            >
                                Add to Bag
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;