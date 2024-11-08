<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import AppChart from './AppChart.vue'
import ControlPanel from './ControlPanel.vue'
import FilterControlStrip from './FilterControlStrip.vue'
import ResultStrip from './ResultStrip.vue'

import { ref } from 'vue'
const chartRef = ref(null)
const resultStripRef = ref(null)

</script>

<template>
  <div class='main-box'>
    <AppHeader/>
    <div class='first-row'>
      <AppChart class='app-chart' ref='chartRef' />
      <ControlPanel class='app-control' @save-chart='chartRef.saveChart()' @save-scheme='resultStripRef.saveScheme()'/>
    </div>
    <FilterControlStrip />
    <ResultStrip ref='resultStripRef' />
    <AppFooter/>
  </div>
</template>

<style scoped>
.main-box {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: start;
  gap: 10px;
}
.app-chart {
  width: 100%;
  max-width: 700px;
  justify-self: center;
}
.app-control {
  flex: 1;
  min-width: 350px;
  max-width: 700px;
  justify-self: center;
}
.first-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

</style>
