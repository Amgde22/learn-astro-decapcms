<template>

        <sl-carousel 
         mouse-dragging 
         style="--aspect-ratio: 16/9;" 
         ref="carousel"
         class="carousel"
         @sl-slide-change="handleSlideChange"
         
         >


          <sl-carousel-item
            v-for="(image, index) in carouselImages" :key="index"
            class="carousel-product-image"
            @click="openZoomModal"
             >
            <img
            loading="lazy"
              :alt="`${name} - Image ${index + 1}`"
              :src="image.src"
            />
          </sl-carousel-item>

      </sl-carousel>

        <div class="pagination-container">
          <button
          v-for="(image, index) in carouselImages" :key="index"
          :class="['pagination-item',{active:slideIndex == index}]"
            @click="goToSlide(index)"
          ></button>
        </div>


             <!-- image zoom -->
     <dialog 
        ref="imageZoomModal" 
        class="image-modal"
        >
          <span @click="closeZoomModal()" class="close">&times;</span>
          <div style="height: 100%;display: grid;place-items: center;">
            <img class="image-modal-content" :src="visibleSlideImageSrc">
          </div>
      </dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, toValue } from 'vue';

import placeHolderImage from "@assets/images/placeholder.jpg";


import '@shoelace-style/shoelace/dist/components/carousel/carousel.js';
import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'; // spinner
import {playSwipeSound,getImageSrc} from "@/js/utils.js"

const props = defineProps({
  name:String,
    carouselImages:{
        type:Array
    }
})

const fallbackImageSrc = placeHolderImage.src;

// carousel
const carousel = ref(null)
function goToSlide(index) {
  playSwipeSound()
  carousel.value.goToSlide(index)
}
// image zoom
const imageZoomModal = ref(null)
const slideIndex = ref(0)
const visibleSlideImageSrc = computed(()=>{
  const index = slideIndex.value ?? 0
  
  const images = props.carouselImages.map(image => getImageSrc(image))

  // console.log(props.productImages);
  // first log {}
  // second log image: { src: 'https://m.media-amazon.com/images/I/61Mk3YqYHpL.jpg' }
  const visibleImageSrc = images[index]

  if (visibleImageSrc) {
    return visibleImageSrc
  }

  else{
    console.log("no imagino brother");
    console.log({images});
    return fallbackImageSrc
  }
})
function handleSlideChange(event) {
  slideIndex.value = event.detail.index
}
function openZoomModal() {
  imageZoomModal.value.showModal()
}
function closeZoomModal() {
  imageZoomModal.value.close()
}


</script>

<style lang="less"  scoped>
/* ==========================================================================
   Carousel Styles (.carousel)
   ========================================================================== */

   .carousel ,.carousel::part(base){
    max-height: 90%;
   }
.carousel {
  position: relative;
  z-index: 1;
  & img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

}
.pagination-container{

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.pagination-item {
    --size: 16px;
    width: var(--size);
    height: var(--size);
    border: none;
    border-radius: 100%;
    background-color: rgb(161, 161, 161);
    &:hover{
      opacity: 0.85;
    }
  }
  .pagination-item.active {
    background-color: var(--medium);
  }

  // image zoom
/* The Modal (background) */
.image-modal {

margin: 0;
border: none;

position: fixed; /* Stay in place */
z-index: 100; /* Sit on top */
inset: 0 !important;
width: 100%; /* Full width */
max-width: none;
height: 100%; /* Full height */
max-height: none;
background-color: rgb(0,0,0); /* Fallback color */
background-color: rgba(0,0,0,0.9); /* Black w/ opacity */


}

/* Modal Content (image) */
.image-modal-content {
margin: auto;
display: block;
max-width: 80%;
max-height: 80%;
}


/* Add Animation */
.image-modal-content {  
-webkit-animation-name: zoom;
-webkit-animation-duration: 200ms;
animation-name: zoom;
animation-duration: 200ms;
animation-timing-function: ease-out;
}

@-webkit-keyframes zoom {
from {-webkit-transform:scale(0)} 
to {-webkit-transform:scale(1)}
}
@keyframes zoom {
from {transform:scale(0)} 
to {transform:scale(1)}
}

/* The Close Button */
.close {
position: absolute;
top: 15px;
right: 35px;
color: #f1f1f1;
font-size: 40px;
font-weight: bold;
transition: 0.3s;
}

.close:hover,
.close:focus {
color: #bbb;
text-decoration: none;
cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px){
.image-modal-content {
  width: 100%;
  max-width: none;
  max-height: none;
}
}
  /* ==========================================================================
   Dark Mode Styles (body.dark-mode)
   ========================================================================== */

@media only screen and (min-width: 0rem) {
    body.dark-mode {
        .pagination-item {
      background-color: var(--dark);
    }

    .pagination-item.active {
      background-color: rgb(213, 213, 213) !important; 
    }
    }
}
</style>