import React from "react";
import PropTypes from "prop-types";

const stories = [
    {
        title: "The Journey to relaxation.",
        description: "Finding a hammock you can truly relax in didn't happen overnight. it started with a chance discovery while on vacation, and took a lot of hanging around to bring the softest, most comfortable,and thoughtfully crafted hammocks to your backyard.",
        image: "/product-1.jpg",
    },
    {
        title: "The way to heaven.",
        description: "More off this less hello salamander lied porpoise much over tightly circa horse taped so innocently outside crud mightly rigorous megative one inside opaquely. Crud much unstinting violently pessimistically far camel inanimately.",
        image: "/product-1.jpg",
    },
];

const StoryItem = ({item, index}) => {
    const {title, description, image} = item;
    return (
        <>
            <div className={`col-span-12 md:col-span-5 ${index % 2 === 0 ? "order-1 md:order-2 md:col-start-7" : "order-2 md:order-1 md:col-start-2"}`}>
                <div className={`flex flex-col justify-center ${index % 2 === 0 ? "lg:pl-14" : "lg:pr-14"}`}>
                    <h4 className="text-2xl font-bold mb-4">{title}</h4>
                    <p className="text-base leading-relaxed text-justify opacity-70 mb-0 md:pr-6">{description}</p>
                </div>
            </div>
            <div className={`${index % 2 === 0 ? "order-1 md:col-start-2" : "order-2 md:order-2 md:col-start-7"} col-span-12 md:col-span-5 mb-6 md:mb-0 mt-6 md:mt-0`}>
                <div>
                    <img src={image} alt={title} className="max-w-full h-auto rounded-2xl"/>
                </div>
            </div>
        </>
    );
};

StoryItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

const AboutUs6 = () => {
    return (
        <section className="ezy_about6 light py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white">
            <div className="container px-4">
                <div className="grid grid-cols-12 justify-center text-center mb-12">
                    <div className="col-span-12 md:col-span-8 md:col-start-3">
                        <h2 className="text-4xl leading-snug md:text-5xl md:leading-snug font-bold mb-6">Our Story</h2>
                        <p className="text-xl opacity-80 mb-4">
                            We not only make the world's most comfortable hammocks, but
                            through training and sustainable job creation, we empower our
                            weavers and their families to break the cycle of poverty and build
                            a brighter future.
                        </p>
                    </div>
                </div>

                {stories.map((item, i) => (
                    <div className="grid grid-cols-12 justify-center items-center mt-12" key={i}>
                        <StoryItem item={item} index={i + 1}/>
                    </div>
                ))}
            </div>
        </section>
    );
};