<script setup>
import ResultGround from './base-components/ResultGround.vue'

</script>

<template>
  <svg viewBox='0 0 40 100' xmlns='http://www.w3.org/2000/svg'>
    <g opacity="1">
      <rect x="5" y="5" width="30" height="90" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linejoin="bevel" stroke-dasharray="2" />
      <line x1="20" y1="24" x2="40" y2="24" stroke="currentColor" stroke-width="0.6" />
    </g>
    <circle cx="20" cy="24" r="1" fill="currentColor" />
    <line x1="20" y1="24" x2="20" y2="42" stroke="currentColor" stroke-width="0.6" opacity="1" />
    <line x1="20" y1="58" x2="20" y2="74" stroke="currentColor" stroke-width="0.6" opacity="1" />
    <ResultGround transform="translate(20 74)" />
    <g transform="translate(20 50)">
      <circle cx="0" cy="0" r="8" fill="none" stroke="currentColor" stroke-width="1" />
      <path fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" d="M-5 0C-3.6-5.5-1.299999-5.599998 0 0 1.700001 5.5 3.5 5.400002 5 0" />
    </g>
  </svg>
</template>