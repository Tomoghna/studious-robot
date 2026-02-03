import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
            <Box
                sx={{ display: 'flex', transition: 'transform 500ms ease-out', height: { xs: 300, sm: 400, md: 500 } }}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((image, index) => (
                    <Box key={index} sx={{ minWidth: '100%', flexShrink: 0 }}>
                        <Box component="img" src={image} alt={`Slide ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                ))}
            </Box>

            {/* Navigation Arrows */}
            <IconButton onClick={goToPrevious} sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'common.white', display: { xs: 'none', sm: 'inline-flex' } }} aria-label="Previous slide">
                <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={goToNext} sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'common.white', display: { xs: 'none', sm: 'inline-flex' } }} aria-label="Next slide">
                <ChevronRightIcon />
            </IconButton>

            {/* Slide Indicators */}
            <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
                {images.map((_, index) => (
                    <Box key={index} onClick={() => goToSlide(index)} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: index === currentIndex ? 'common.white' : 'rgba(255,255,255,0.6)', cursor: 'pointer' }} />
                ))}
            </Box>
        </Box>
    );
};

export default Carousel;