<script setup>
import ResultResistor from '../base-components/ResultResistor.vue'
import ResultInductor from '../base-components/ResultInductor.vue'
import ResultCapacitor from '../base-components/ResultCapacitor.vue'
import FilterBox from '../base-components/FilterBox.vue'

defineProps(['filter', 'withR'])

</script>

<template>
  <FilterBox width='100'>
    <ResultCapacitor transform="translate(10 24)" :value='filter.instance.c1' />
    <ResultInductor transform="translate(50 24)" :value='filter.instance.l1' :dcr='filter.instance.l1r' />
    <ResultResistor transform="translate(10 48)" :value='filter.instance.r' v-if='withR' />
    <line x1="10" y1="24" x2="10" y2="48" stroke="currentColor" stroke-width="0.6" opacity="1" v-if='withR' />
    <line x1="90" y1="24" x2="90" y2="48" stroke="currentColor" stroke-width="0.6" opacity="1" v-if='withR' />
    <line x1="50" y1="48" x2="90" y2="48" stroke="currentColor" stroke-width="0.6" opacity="1" v-if='withR' />
  </FilterBox>
</template>