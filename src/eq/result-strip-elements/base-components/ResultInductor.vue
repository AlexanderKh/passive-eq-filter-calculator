<script setup>
const props = defineProps(['value', 'dcr'])

function valueText() {
  const inMilliHenry = (props.value * 1000)
  if (inMilliHenry >= 1000) {
    return inMilliHenry.toFixed(0)
  } else if (inMilliHenry >= 100) {
    return inMilliHenry.toFixed(1)
  } else {
    return inMilliHenry.toFixed(2)
  }
}

// eslint-disable-next-line
function dcrText() {
  const dcr = props.dcr || 0;
  if (dcr < 10) {
    return dcr.toFixed(1)
  } else {
    return dcr.toFixed(0)
  }
}
</script>

<template>
  <g>
    <circle cx="0" cy="0" r="1" fill="currentColor" />
    <circle cx="40" cy="0" r="1" fill="currentColor" />
    <line x1="0" y1="0" x2="10" y2="0" stroke="currentColor" stroke-width="0.6" />
    <line x1="30" y1="0" x2="40" y2="0" stroke="currentColor" stroke-width="0.6" />
    <path d="M10 0C11.34-5 14.719999-5 16.26-.1 17.879999 5.2 9.969999 3.7 15.11-2.55 17.59-4.95 18.209999-3.7 20.189999-2.5 24.559999 4.9 15.03 4.7 19.59-2.5 20.939999-4.3 22.91-4.1 24.25-2.65 19.469999 5 29.529999 4.9 24.91-2.55 25.529999-2.9 27.529999-6.2 29.950001 0" stroke="currentColor" fill="none" stroke-linecap="round" />
    <text x="20" y="-8" fill="currentColor" font-size="8" text-anchor='middle'>{{ valueText() }} mH</text>
<!--    <text x="20" y="10" fill="currentColor" font-size="7" text-anchor='middle'>DCR: {{ dcrText() }} Ω</text>-->
  </g>
</template>