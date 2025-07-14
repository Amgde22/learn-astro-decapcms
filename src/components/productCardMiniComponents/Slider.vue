<template>
  <div class="scrollable-gallery-wrapper">
    <div
      ref="scrollContainer"
      class="scroll-container"
      :class="{ 'is-dragging': isDragging }"
      @mousedown.prevent="onDragStart"
      @touchstart.prevent.stop="onDragStart"
      @mousemove="onDragMove"
      @touchmove="onDragMove"
      @mouseup="onDragEnd"
      @mouseleave="onDragEnd" 
      @touchend="onDragEnd"
      @touchcancel="onDragEnd"
    >
      <div
        ref="galleryTrack"
        class="gallery-track"
      >
        <!-- Display all processed images -->
      <div
        v-for="(image, index) in processedImages"
        :key="image.key || index"
        class="gallery-item"
        @click="handleImageClick(image.src)"
        @touchend="handleImageClick(image.src)"
      >
          <img
            loading="lazy"
            draggable="false"
            :alt="`${name} - Image ${index + 1}`"
            :src="image.src"
          />
        </div>
      </div>
    </div>

    <!-- Pagination is removed -->

    <!-- Image zoom dialog remains the same, uses zoomedImageSrc ref -->
    <dialog ref="imageZoomModal" class="image-modal">
      <span @click="closeZoomModal()" class="close" aria-label="Close zoom view">×</span>
      <div class="modal-content-wrapper">
        <img class="image-modal-content" :src="zoomedImageSrc" alt="Zoomed product image" />
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import placeHolderImage from "@assets/images/placeholder.jpg";
// playSwipeSound might not be relevant anymore, but keep getImageSrc
import { getImageSrc } from "@/js/utils.js";

const props = defineProps({
  name: String,
  carouselImages: {
    type: Array,
    default: () => []
  }
});

const fallbackImageSrc = placeHolderImage;

// --- Refs for DOM Elements ---
const scrollContainer = ref(null);
const galleryTrack = ref(null); // Ref for the track if needed, though scrolling is on container
const imageZoomModal = ref(null);

// --- Scroll/Drag State ---
const isDragging = ref(false);
const startX = ref(0);
const scrollLeftStart = ref(0); // Store initial scrollLeft on drag start
const distanceDragged = ref(0); // To differentiate clicks from small drags

// --- Image Zoom State ---
const zoomedImageSrc = ref(fallbackImageSrc); // Holds the src for the zoomed image

// --- Computed Properties ---
const processedImages = computed(() => {
  // Ensure images have a usable src and a key
  if (!Array.isArray(props.carouselImages) || props.carouselImages.length === 0) {
    return [{ src: fallbackImageSrc, key: 'fallback-0' }];
  }
  return props.carouselImages.map((img, index) => ({
    src: getImageSrc(img) || fallbackImageSrc,
    key: img?.id || `gallery-item-${index}` // Provide a unique key
  }));
});

// No slideIndex or totalSlides needed anymore

// --- Methods ---

// --- Drag Handlers ---
function onDragStart(event) {
  if (!scrollContainer.value) return;

  isDragging.value = true;
  startX.value = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
  scrollLeftStart.value = scrollContainer.value.scrollLeft; // Record current scroll position
  distanceDragged.value = 0;
  scrollContainer.value.style.scrollSnapType = 'none'; // Disable snap during drag
  scrollContainer.value.style.cursor = 'grabbing'; // Update cursor
  // console.log("Drag Start", { startX: startX.value, scrollLeftStart: scrollLeftStart.value });
}

function onDragMove(event) {
  if (!isDragging.value || !scrollContainer.value) return;

  event.preventDefault(); // Prevent default browser dragging/scrolling behavior

  const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
  const walk = (currentX - startX.value) * 1.5; // Multiply for faster/more natural drag feel (optional)
  distanceDragged.value = Math.abs(currentX - startX.value);

  // Update scrollLeft directly
  scrollContainer.value.scrollLeft = scrollLeftStart.value - walk;
  // console.log("Drag Move", { currentX, walk, newScrollLeft: scrollContainer.value.scrollLeft });
}

function onDragEnd() {
  if (!isDragging.value || !scrollContainer.value) return;

  isDragging.value = false;
  scrollContainer.value.style.scrollSnapType = ''; // Re-enable snap if needed (e.g., 'x mandatory') - might not be needed here
  scrollContainer.value.style.cursor = 'grab'; // Restore cursor

  // console.log("Drag End");
  // No index change or snapping logic needed here. Scrolling stops.
}
function handleImageClick(src) {
  if (isDragging.value || distanceDragged.value > 10) return;
  openZoomModal(src);
}
// --- Image Zoom ---
// Accepts the src directly now
function openZoomModal(imageSrc) {
  if (!imageSrc) return; // Don't open if src is invalid
  zoomedImageSrc.value = imageSrc;

  if (imageZoomModal.value && typeof imageZoomModal.value.showModal === 'function') {
    imageZoomModal.value.showModal();
  } else {
    console.error("Zoom modal reference is not available or not a dialog element.");
  }
}

function closeZoomModal() {
  if (imageZoomModal.value && typeof imageZoomModal.value.close === 'function') {
    imageZoomModal.value.close();
    // Optionally reset zoomedImageSrc if needed, though not strictly necessary
    // zoomedImageSrc.value = fallbackImageSrc;
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  // Optional: Add keyboard navigation listener for scrolling
   window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  // Clean up listeners
   window.removeEventListener('keydown', handleKeydown);
  // Drag listeners on the element are handled by Vue
});

// --- Accessibility (Example: Keyboard Scroll) ---
function handleKeydown(event) {
    if (!scrollContainer.value || document.activeElement !== scrollContainer.value) {
       // Only scroll if the container is focused (or based on other logic)
       // return; // Disabled for now to allow global arrow key scroll - adjust as needed
    }

   const scrollAmount = 100; // Pixels to scroll with arrow keys

   if (event.key === 'ArrowLeft') {
       event.preventDefault(); // Prevent page scroll
       scrollContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
   } else if (event.key === 'ArrowRight') {
       event.preventDefault(); // Prevent page scroll
       scrollContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
   }
}

</script>

<style lang="less" scoped>
/* ==========================================================================
   Scrollable Gallery Styles
   ========================================================================== */

.scrollable-gallery-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 8px; // Space below gallery
}

.scroll-container {
  position: relative;
  width: 100%;
  overflow-x: auto; // Enable horizontal scrolling
  overflow-y: hidden; // Hide vertical scrollbar if content overflows height


  cursor: grab;
  user-select: none;
  -webkit-overflow-scrolling: touch; // Smooth scrolling on iOS
  scroll-behavior: smooth; // For programmatic scrolling (keyboard)

  // Hide scrollbar visually (cross-browser)
  scrollbar-width: none; // Firefox
  &::-webkit-scrollbar {
    display: none; // Safari and Chrome
  }

  &.is-dragging {
    cursor: grabbing;
    scroll-behavior: auto; // Use immediate scroll during drag
  }
}

.gallery-track {
  display: inline-flex; // Use inline-flex to allow items to sit side-by-side and track width to fit content
  align-items: stretch; // Stretch items to container height if needed
  padding: 4px; // Small padding around the track
  gap: 12px; // Gap between gallery items
  min-width: 100%; // Ensure track fills container even with few items
}

.gallery-item {
  flex-shrink: 0; // Prevent items from shrinking
  // Define item size - adjust as needed
  height: 150px; // Example fixed height
  width: auto; // Let width be determined by aspect ratio
  // Or:
  // width: 200px;
  // height: auto;

  border-radius: 6px; // Rounded corners for items
  overflow: hidden; // Clip image content
  background-color: #eee; // Placeholder background
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover; // Cover the item area, might crop
    // object-fit: contain; // Contain within item area, might leave gaps
    pointer-events: none; // Prevent image's default drag
  }
}

/* Pagination styles are removed */

/* ==========================================================================
   Image Zoom Modal Styles (Unchanged)
   ========================================================================== */
.image-modal { /* ... keep styles from previous version ... */
  margin: 0;
  border: none;
  padding:0;
  position: fixed;
  z-index: 1000;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  background-color: rgba(0, 0, 0, 0.85);
  overflow: hidden;
  &::backdrop { background-color: rgba(0, 0, 0, 0.85); }
}
.modal-content-wrapper { /* ... keep styles from previous version ... */
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.image-modal-content { /* ... keep styles from previous version ... */
  display: block;
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  animation: zoom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes zoom { /* ... keep styles from previous version ... */
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.close { /* ... keep styles from previous version ... */
  position: absolute;
  top: 20px;
  right: 30px;
  color: #f1f1f1;
  font-size: 45px;
  font-weight: bold;
  line-height: 1;
  transition: 0.3s ease;
  cursor: pointer;
  z-index: 1001;
  &:hover, &:focus { color: #bbb; transform: scale(1.1); }
}
@media only screen and (max-width: 700px){ /* ... keep styles from previous version ... */
  .image-modal-content { width: 100%; max-width: 100%; height: 100%; max-height: 100%; object-fit: contain; }
  .close { top: 15px; right: 20px; font-size: 35px; }
}

/* ==========================================================================
   Dark Mode Styles (Adapted)
   ========================================================================== */
 body.dark-mode {

    .gallery-item {
        background-color: #333;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        &:hover {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }
    }
    /* Pagination dark mode styles removed */
    .close { /* ... keep dark mode styles from previous version ... */
        color: #ccc;
        &:hover, &:focus { color: #fff; }
    }
 }
</style>