<template>
  <a
  :href="href" :target="href?'_blank':''"
    class="custom-button"
    :class="[classes, { collapse: collapse }]"
    :style="{ fontSize: fontSize }"
  >
    <slot name="icon-start"></slot>
    <slot></slot>
    <slot name="icon-end"></slot>
</a>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  fontSize: {
    type: String,
    default: '1rem'
  },
  classes: {
    type: String,
    default: ''
  },
  collapse: {
    type: Boolean,
    default: false
  },
  href:{
    type:String,
    Default:""
  }
});


</script>

<style scoped lang="less">
.custom-button {
  --text-color: black;
  --background-color: var(--primaryLight);
  --icon-color: white;

  background-color: var(--background-color);
  color: var(--text-color);

  width: max-content;
  font-size: 1rem;
  padding: 0.45em 1.5em;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  gap: 0.25em;
  box-shadow:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) ;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    transform: scale(0);
    width: 2em;
    height: 2em;
    border-radius: 50%;
    background-color: rgb(38, 38, 38);

    transform-origin: center;
    transition: all 250ms ease-in-out;
    z-index: -1;
  }

  &:hover::before {
    transform: scale(6);
  }

  &:hover {
    --text-color: white;
    color: var(--text-color);
  }

  ::v-deep ::slotted([slot="icon-start"]),
  ::v-deep ::slotted([slot="icon-end"]) {
    fill: var(--icon-color);
    width: 1em;
    height: 1em;
    z-index: 1;
  }

  svg {
    z-index: 1;
  }
}

// mobile styles
@media only screen and (max-width: 1023px) {
  .custom-button.collapse {
    box-sizing: border-box;
    padding: 8px;
    border-radius: 100%;
  }
}

// dark mode
@media only screen and (min-width: 0rem) {
  body.dark-mode {
    .custom-button {
      --background-color: var(--medium);
      --text-color: white;
    }
  }
}
</style>