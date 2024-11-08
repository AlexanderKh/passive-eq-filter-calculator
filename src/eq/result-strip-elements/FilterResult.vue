<script setup>
import { computed } from 'vue'

import BellUpOrBandpass from './filters/BellUpOrBandpass.vue'
import BellDownOrNotch from './filters/BellDownOrNotch.vue'
import LowPassShelf1Order from './filters/LowPassShelf1Order.vue'
import HighPassShelf1Order from './filters/HighPassShelf1Order.vue'
import LowPass2Order from './filters/LowPass2Order.vue'
import HighPass2Order from './filters/HighPass2Order.vue'

const props = defineProps(['filter'])
const info = computed(() => {
  return props.filter.info
})

</script>

<template>
  <BellDownOrNotch v-if='info.type === "simple-bell-down"' :filter='filter' :withR='true'/>
  <BellUpOrBandpass v-if='info.type === "simple-bell-up"' :filter='filter' :withR='true'/>
  <BellDownOrNotch v-if='info.type === "simple-notch"' :filter='filter' :withR='false'/>
  <BellUpOrBandpass v-if='info.type === "simple-bandpass"' :filter='filter' :withR='false'/>
  <LowPassShelf1Order v-if='info.category === "lowpass" && info.order === 1' :filter='filter' :shelf='false'/>
  <LowPassShelf1Order v-if='info.category === "lowshelf" && info.order === 1' :filter='filter' :shelf='true'/>
  <HighPassShelf1Order v-if='info.category === "highpass" && info.order === 1' :filter='filter' :shelf='false'/>
  <HighPassShelf1Order v-if='info.category === "highshelf" && info.order === 1' :filter='filter' :shelf='true'/>
  <LowPass2Order v-if='info.category === "lowpass" && info.order === 2' :filter='filter'/>
  <HighPass2Order v-if='info.category === "highpass" && info.order === 2' :filter='filter'/>
</template>