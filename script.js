let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index)
{
    slides.forEach((slide, i) =>
    {
        slide.computedStyleMap.transform = `translateX(${100 * (i - index)}%)`;
    });
}

function moveSlide(n)
{
    slideIndex = (slideIndex + n + totalSlides) % totalSlides;
    showSlide(slideIndex);
}

function autoSlide()
{
    moveSlide(1);
    setTimeout(autoSlide, 5000);
}

document.addEventListener('DOMContentLoaded', () =>
{
    showSlide(slideIndex);
    autoSlide();
});