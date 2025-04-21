import React, { useState, useEffect, useRef } from "react";

const Carousel = ({ images, autoplayInterval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const autoplayTimerRef = useRef(null);

    const startAutoplay = () => {
        stopAutoplay();
        autoplayTimerRef.current = setInterval(() => {
            goToNext();
        }, autoplayInterval);
    };

    const stopAutoplay = () => {
        if (autoplayTimerRef.current) {
            clearInterval(autoplayTimerRef.current);
        }
    };

    useEffect(() => {
        startAutoplay();
        return () => stopAutoplay();
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
        startAutoplay();
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        startAutoplay();
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        startAutoplay();
    };

    const handleTouchStart = (e) => {
        stopAutoplay();
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (Math.abs(distance) < minSwipeDistance) return;

        if (distance > 0) {
            goToNext();
        } else {
            goToPrevious();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <div
                className="flex transition-transform duration-500 ease-out h-[300px] sm:h-[400px] md:h-[500px]"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors duration-200 hidden sm:block"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-colors duration-200 hidden sm:block"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                            index === currentIndex
                                ? "bg-white"
                                : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;