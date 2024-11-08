<script setup>
defineProps(['value'])
</script>

<template>
  <g>
    <circle cx="0" cy="0" r="1" fill="currentColor" />
    <circle cx="40" cy="0" r="1" fill="currentColor" />
    <line x1="0" y1="0" x2="7.5" y2="0" stroke="currentColor" stroke-width="0.6" />
    <line x1="32.5" y1="0" x2="40" y2="0" stroke="currentColor" stroke-width="0.6" />
    <rect x="7.5" y="-5" width="25" height="10" fill="none" stroke="currentColor" />
    <text x="20" y="-8" fill="currentColor" font-size="8" text-anchor='middle'>{{ value.toFixed(1) }} Ω</text>
  </g>
</template>