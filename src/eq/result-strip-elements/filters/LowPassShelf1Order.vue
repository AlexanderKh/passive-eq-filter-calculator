<script setup>
import ResultInductor from '../base-components/ResultInductor.vue'
import ResultResistor from '../base-components/ResultResistor.vue'
import FilterBox from '../base-components/FilterBox.vue'

defineProps(['filter', 'shelf'])

</script>

<template>
  <FilterBox width='60'>
    <ResultInductor transform="translate(10 24)" :value='filter.instance.l1' :dcr='filter.instance.l1r' />
    <line x1='10' x2='10' y1='24' y2='52' stroke="currentColor" stroke-width="0.6" v-if='shelf'/>
    <line x1='50' x2='50' y1='24' y2='52' stroke="currentColor" stroke-width="0.6" v-if='shelf'/>
    <ResultResistor transform="translate(10 52)" :value='filter.instance.r' v-if='shelf'/>
  </FilterBox>
</template>