<script setup>
import ResultResistor from '../base-components/ResultResistor.vue'
import ResultInductor from '../base-components/ResultInductor.vue'
import ResultCapacitor from '../base-components/ResultCapacitor.vue'
import FilterBox from '../base-components/FilterBox.vue'

defineProps(['filter', 'withR'])

</script>

<template>
  <FilterBox width='60'>
    <ResultCapacitor transform="translate(10 24)" :value='filter.instance.c1' />
    <ResultInductor transform="translate(10 48)" :value='filter.instance.l1' :dcr='filter.instance.l1r' />
    <ResultResistor transform="translate(10 76)" :value='filter.instance.r' v-if='withR' />
    <line x1="10" y1="24" x2="10" :y2="withR ? 76 : 48" stroke="currentColor" stroke-width="0.6" opacity="1" />
    <line x1="50" y1="24" x2="50" :y2="withR ? 76 : 48" stroke="currentColor" stroke-width="0.6" opacity="1" />
  </FilterBox>
</template>