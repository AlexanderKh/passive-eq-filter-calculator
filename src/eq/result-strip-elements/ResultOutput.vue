<script setup>
import ResultGround from './base-components/ResultGround.vue'

defineProps(['value'])

</script>

<template>
  <svg viewBox='0 0 40 100' xmlns='http://www.w3.org/2000/svg'>
    <g opacity='1'>
      <rect x='5' y='5' width='30' height='90' fill='none' stroke='currentColor' stroke-width='0.5'
            stroke-linejoin='bevel' stroke-dasharray='2' />
      <line x1='0' y1='24' x2='20' y2='24' stroke='currentColor' stroke-width='0.6' />
    </g>
    <circle cx='20' cy='24' r='1' fill='currentColor' />
    <line x1='20' y1='24' x2='20' y2='46' stroke='currentColor' stroke-width='0.6' opacity='1' />
    <line x1='20' y1='54' x2='20' y2='74' stroke='currentColor' stroke-width='0.6' opacity='1' />
    <g>
      <rect width='3' height='8' x='18' y='46' fill='none' stroke='currentColor' />
      <line x2='28' stroke='currentColor' y2='42' x1='21' y1='48' />
      <line x2='28' stroke='currentColor' y2='58' x1='21' y1='52' />
      <line x2='28' stroke='currentColor' y2='58' x1='28' y1='42' />
    </g>
    <ResultGround transform='translate(20 74)' />
    <text x="0" y="0" fill="currentColor" font-size="8" text-anchor='middle' transform='translate(16 50) rotate(-90)'>{{ value.toFixed(1) }} Ω</text>
  </svg>
</template>