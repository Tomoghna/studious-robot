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
      {/* the loading attribute of the html img tag specifies how the browser should handle the loading of an image. It offers control over whether an image is loaded immediately or deffered until it is needed, which can significantly impact page loading performance. */}
    </div>
  )
}


/* the loading attribute accepts the following values:
eager: This value instructs the browser to load the image immediately, regardless of its position relative to the visible viewport. This is the default behavior if the loading attribute is not explicitly set. It is suitable for images that are critical for the initial display of the page, such as a hero image or a logo in the header.

lazy: this value tells the browser to defer loading the image until it is within a calculated distance from the visible viewport. This means the image will only be loaded when the user scrolls near it. This is highly beneficial for optimizing performance on pages with many images, especially those below the initial fold, as it prevents unnecessary downloads and reduces initial page load time. 

auto: this value allows the browser to determine the optimal loading behavior. The browser will decide whether to load the image eagerly or lazily based on its own heuristic and user's connection. */