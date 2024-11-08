<script setup>
import ResultInductor from '../base-components/ResultInductor.vue'
import ResultCapacitor from '../base-components/ResultCapacitor.vue'
import ResultGround from '../base-components/ResultGround.vue'
import FilterBox from '../base-components/FilterBox.vue'

defineProps(['filter'])

</script>

<template>
  <FilterBox width='70'>
    <ResultInductor transform="translate(10 24)" :value='filter.instance.l1' :dcr='filter.instance.l1r' />
    <ResultCapacitor transform="translate(50 74), rotate(-90)" :value='filter.instance.c1' />
    <ResultGround transform="translate(50 74)" />
    <line x1="50" y1="24" x2="50" y2="34" stroke="currentColor" stroke-width="0.6" />
    <line x1="50" y1="24" x2="60" y2="24" stroke="currentColor" stroke-width="0.6" />
  </FilterBox>
</template>