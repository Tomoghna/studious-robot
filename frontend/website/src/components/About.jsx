import React from "react";

const AboutUs6 = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh]">
        <img
          src="/banner-2.jpg"
          alt="About Us Banner"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Mission Statement */}
          <section className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              At MAYUR HAMSA, we are dedicated to preserving and promoting the rich heritage 
              of traditional Indian art and craftsmanship while bringing its beauty to homes 
              around the world.
            </p>
          </section>

          {/* Values Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Artisanal Excellence
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Each piece in our collection is carefully handcrafted by skilled artisans, 
                ensuring the highest quality and attention to detail.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sustainable Practices
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We are committed to eco-friendly practices, using sustainable materials 
                and supporting local communities.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Cultural Heritage
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our designs draw inspiration from India's rich cultural heritage, 
                bringing traditional art forms into contemporary spaces.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Customer Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We strive to provide an exceptional shopping experience, from product 
                selection to delivery and after-sales support.
              </p>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <img
                  src="/products/product-16.jpg"
                  alt="Team Member"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ParamShantim Das
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Founder & Artist</p>
              </div>
              {/* Add more team members as needed */}
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
            <a
              href="mailto:info@mayurhamsa.com"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs6;