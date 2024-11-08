<script setup>
const props = defineProps(['width'])

</script>

<template>
  <svg :viewBox="`0 0 ${props.width} 100`" xmlns="http://www.w3.org/2000/svg">
    <g opacity="1">
      <rect x="5" y="5" :width="props.width - 10" height="90" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linejoin="bevel" stroke-dasharray="2" />
      <line x1="0" y1="24" x2="10" y2="24" stroke="currentColor" stroke-width="0.6" />
      <line :x1="props.width - 10" y1="24" :x2="props.width" y2="24" stroke="currentColor" stroke-width="0.6" />
    </g>
    <slot/>
  </svg>
</template>