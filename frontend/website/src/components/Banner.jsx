import React from 'react'

export default function Banner() {
  return (
    <div className="relative w-full bg-gray-100 dark:bg-gray-800">
      <img 
        src="/banner-2.jpg" 
        alt="banner" 
        className="w-full h-32 sm:h-48 md:h-64 object-cover"
        loading="eager"
      />
    </div>
  )
}
