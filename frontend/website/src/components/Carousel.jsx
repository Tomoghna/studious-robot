import React, { useState, useEffect } from "react";

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex transition-transform duration-500" style={{transform: `translateX(-${currentIndex * 100}%)`}}>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`Slide ${index + 1}`} className="w-full h-[500px] object-cover" />
                ))}
            </div>

            <button onClick={goToPrevious} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">&#8592;</button>
            <button onClick={goToNext} className="absolute top-1/2 right-4 tranform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">&#8594;</button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-blue-500" : "bg-gray-300"}`} />
                ))}
            </div>
        </div>
    );
};

export default Carousel;