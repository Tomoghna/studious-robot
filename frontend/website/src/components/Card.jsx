import React, {useState, useEffect} from "react";

const ProductCard = ({product}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let interval;
        if(isHovered) {
            interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isHovered, product.images.length]);

    return (
        <div className="relative bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg w-72 mx-auto" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="w-full h-64 overflow-hidden">
                <img src={product.images[currentImageIndex]} alt={product.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                <p className="text-lg font-bold text-green-600 mt-2">${product.price}</p>

                <div className="flex justify-between mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Buy Now</button>
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Add to Bag</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;