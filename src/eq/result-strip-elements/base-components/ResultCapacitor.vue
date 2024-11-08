<script setup>
const props = defineProps(['value'])

function valueText() {
  const inMicroFarads = (props.value * 1000000)
  if (inMicroFarads >= 1000) {
    return inMicroFarads.toFixed(0)
  } else if (inMicroFarads < 10) {
    return inMicroFarads.toFixed(2)
  } else {
    return inMicroFarads.toFixed(1)
  }
}
</script>

<template>
  <g>
    <circle cx="0" cy="0" r="1" fill="currentColor" />
    <circle cx="40" cy="0" r="1" fill="currentColor" />
    <line x1="0" y1="0" x2="18" y2="0" stroke="currentColor" stroke-width=".6" />
    <line x1="22" y1="0" x2="40" y2="0" stroke="currentColor" stroke-width=".6" />
    <line x1="18" y1="-5" x2="18" y2="5" stroke="currentColor" stroke-width="1" />
    <line x1="22" y1="-5" x2="22" y2="5" stroke="currentColor" stroke-width="1" />
    <text x="20" y="-8" fill="currentColor" font-size="8" text-anchor='middle'>{{ valueText() }} µF</text>
  </g>
</template>