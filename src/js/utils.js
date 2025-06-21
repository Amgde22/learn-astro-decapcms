import swipeSfx from "/assets/sfx/swipe-sfx.mp3"


export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function getCurrentYear() {
  return new Date().getFullYear();
}

import { getImage } from "astro:assets";
export async function getOptimizedImage(image) {
  const optimizedImage = await getImage({
    src: image,
    format: "webp",
  });

  return optimizedImage
}

export async function getOptimizedCardImage(image) {
  // returns an object with a src property
  if (typeof image == "string") {
    return {src:image}
  }
  
  const optimizedImage = await getImage({
    src: image,
    format: "webp",
  });

  return optimizedImage
}

// Create an Audio object and load the sound

// Function to play the sound
export function playSwipeSound () {
  if (typeof window === 'undefined') {
    console.warn("Audio API not available in this environment.");
    return; // Exit early if not in a browser
  }
  const swipeSound = new Audio(swipeSfx);

  // Check if the audio is already playing
  if (swipeSound.currentTime > 0 && !swipeSound.paused) {
    // If it's playing, stop and rewind it
    swipeSound.pause();
    swipeSound.currentTime = 0;
  }

  // Play the sound
  swipeSound.play().catch(error => {
    // Handle autoplay errors (common in browsers)
    console.warn("Autoplay prevented:", error);
    // Optionally, provide a user interaction to trigger the sound
  });
};

export function getImageSrc(image) {
  // Check if image is an object and has a src property
  if (image && typeof image === 'object' && image.src) {
    return image.src;
  }
  
  // Otherwise return the original parameter (assuming it's a string path)
  return image;
}

// Learn more agout the getImage() function here
// https://docs.astro.build/en/guides/images/#generating-images-with-getimage