<script setup>
import AddIcon from '../assets/control-icons/plus.svg'
import GeneratorIcon from '../assets/other-icons/generator.svg'
import LoadIcon from '../assets/other-icons/load.svg'
import FilterControl from './FilterControl.vue'
import { nextTick, ref } from 'vue'
import { useEQStore } from './eqStore'
import { storeToRefs } from 'pinia'

const eqStore = useEQStore()
const { filters, loadR } = storeToRefs(eqStore)

const stripRef = ref(null)

function addFilter() {
  eqStore.addFilter()
  nextTick(() => {
    if (stripRef.value) {
      stripRef.value.scrollTo({
        top: 0,
        left: stripRef.value.scrollWidth,
      })
    }
  })
}

</script>

<template>
  <div class='full-strip'>
    <div class='strip-left'>
      <div class='source'>
        <GeneratorIcon/>
      </div>
    </div>
    <div class='filters-strip' ref='stripRef'>
      <TransitionGroup name='filter-controls'>
        <FilterControl v-for='(filter, index) in filters' :filter='filter' :position='index' :key='filter.orderId' />
      </TransitionGroup>
    </div>
    <div class='strip-right'>
      <div class='add-button' @click.prevent='addFilter'>
        <AddIcon class='add-icon'/>
      </div>
      <div class='load-block'>
        <div class='load-input-block'>
          <div class='load-label'>Ω</div>
          <input class='load-input' type='number' min='1' max='99' step='0.1' :value='loadR' @input='evt => eqStore.setR(evt.target.value)'/>
        </div>
        <div class='load'>
          <LoadIcon/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-controls-enter-active {
  animation: scale-ex 0.3s;
}
.filter-controls-leave-to {
  animation: scale-ex 0.3s reverse;
}
.filter-controls-move {
  transition: all 0.4s ease;
}

.full-strip {
  display: flex;
  flex-direction: row;
  height: 165px;
  overflow: hidden;
  justify-content: space-between;
  align-items: center;
}
.filters-strip {
  overflow-y: hidden;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  justify-content: flex-start;
  margin: 0 5px;
  border: 2px solid var(--border-color);
  background-color: var(--section-background-color);
  border-radius: var(--section-border-radius);
}
.add-button {
  background-color: var(--section-background-color);
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  width: 40px;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.5s;
}
.strip-left, .strip-right {
  height: 100%;
  flex: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}
.strip-left {
  align-items: flex-end;
  padding: 2px;
  border-radius: var(--section-border-radius);
  background-color: var(--section-background-color);
  border: 2px solid var(--border-color);
}
.add-button:hover {
  background-color: black;
  color: white;
}
.add-icon {
  vertical-align: text-top;
  height: 24px;
  width: 24px;
}
.source {
  width: 50px;
}
.load-block {
  border-radius: var(--section-border-radius);
  background-color: var(--section-background-color);
  height: 100%;
  margin-left: 5px;
  padding: 2px;
  border: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  position: relative;
}
.load {
  width: 50px;
}
.load-input-block {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
.load-label {
  font-family: sans-serif;
  font-size: small;
  height: 25px;
  line-height: 25px;
  user-select: none;
}
.load-input {
  width: 44px;
  padding: 2px 0 2px 2px;
}
</style>