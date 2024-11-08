<script setup>
import ResultInput from './result-strip-elements/ResultInput.vue'
import ResultOutput from './result-strip-elements/ResultOutput.vue'
import FilterResult from './result-strip-elements/FilterResult.vue'
import { useEQStore } from './eqStore'
import { storeToRefs } from 'pinia'
import domtoimage from 'dom-to-image';
import { ref } from 'vue'

const eqStore = useEQStore()
const { filters, loadR } = storeToRefs(eqStore)

const captureRef = ref(null)

function saveScheme() {
  captureRef.value.style.position = 'fixed'
  captureRef.value.style.top = 0
  captureRef.value.style.left = 0
  captureRef.value.style.height = '300px'
  captureRef.value.style.border = 'none'
  captureRef.value.style.backgroundColor = 'var(--backround-color)'
  domtoimage.toPng(captureRef.value).then((dataUrl) => {
    const schemeURL = document.createElement('a');
    schemeURL.download = 'Electrical Scheme';
    schemeURL.href = dataUrl;
    schemeURL.click();
  }).catch((e) => {
    console.error(e)
  }).finally(() => {
    captureRef.value.style.position = null
    captureRef.value.style.top = null
    captureRef.value.style.left = null
    captureRef.value.style.border = null
    captureRef.value.style.backgroundColor = null
    captureRef.value.style.height = null
  })
}

defineExpose({ saveScheme })
</script>

<template>
  <div class='full-strip' ref='captureRef'>
    <div class='result-element'>
      <ResultInput/>
    </div>


    <TransitionGroup name='filter-results'>
      <div class='result-element' v-for='(filter) in filters' :key='filter.orderId'>
        <FilterResult :filter='filter' />
      </div>
    </TransitionGroup>

    <div class='result-element'>
      <ResultOutput :value='loadR'/>
    </div>
  </div>
</template>

<style scoped>
.filter-results-enter-active {
  animation: scale-ex 0.3s;
}
.filter-results-leave-to {
  animation: scale-ex 0.3s reverse;
}
.filter-results-move {
  transition: all 0.4s ease;
}

.full-strip {
  border-radius: var(--section-border-radius);
  background-color: var(--section-background-color);
  display: flex;
  flex-direction: row;
  height: 180px;
  overflow-x: scroll;
  justify-content: flex-start;
  align-items: center;
  border: 2px solid var(--border-color);
  overflow-y: hidden;
}
</style>

<style>
.result-element {
  height: 100%;
}
.result-element svg {
  height: 100%;
  user-select: none;
}
</style>