<script setup>
import FilterControlKnobs from './FilterControlKnobs.vue'
import {useEQStore} from './eqStore'
import { defineProps, computed } from 'vue'
import { filterGrouping } from './model/filterCollection'
import { inlineCategorySVG, typeLabel } from './uiHelpers'
import CloseIcon from '../assets/control-icons/cross.svg'
import MoveLeftIcon from '../assets/control-icons/move-left.svg'
import MoveRightIcon from '../assets/control-icons/move-right.svg'

const props = defineProps(['position', 'filter'])
const eqStore = useEQStore()

function selectCategory(newCategory) {
  if (props.filter.info.category === newCategory) {
    return
  }

  const newCategoryOrders = filterGrouping[newCategory]
  const defaultOrderTypes = Object.values(newCategoryOrders)[0]
  const defaultOrderFilter = Object.values(defaultOrderTypes)[0]

  eqStore.changeFilter(props.position, defaultOrderFilter.info.name)
}

function selectOrder(newOrder) {
  if (props.filter.info.order.toString() === newOrder.toString()) {
    return
  }

  const orderTypes = filterGrouping[props.filter.info.category][newOrder]
  const defaultOrderFilter = Object.values(orderTypes)[0]

  eqStore.changeFilter(props.position, defaultOrderFilter.info.name)
}

function selectType(newType) {
  if (props.filter.info.type === newType) {
    return
  }

  const newFilter = filterGrouping[props.filter.info.category][props.filter.info.order][newType]

  eqStore.changeFilter(props.position, newFilter.info.name)
}

const currentCategory = computed(() => {
  return props.filter.info.category
})
const currentOrder = computed(() => {
  return props.filter.info.order
})
const currentType = computed(() => {
  return props.filter.info.type
})
const categories = computed(() => {
  return Object.keys(filterGrouping)
})
const groupedCategories = computed(() => {
  return categories.value.reduce((r, cat, i) => (i % 4 ? r[r.length - 1].push(cat) : r.push([cat])) && r, []);
})
const showOrders = computed(() => {
  return Object.keys(filterGrouping[currentCategory.value]).length > 1
})
const orders = computed(() => {
  return Object.keys(filterGrouping[currentCategory.value])
})
const showTypes = computed(() => {
  return Object.keys(filterGrouping[currentCategory.value][currentOrder.value]).length > 1
})
const types = computed(() => {
  return Object.keys(filterGrouping[currentCategory.value][currentOrder.value])
})

function formatCategory(category) {
  return `${category.charAt(0).toUpperCase()}`
}
</script>

<template>
  <div class='knob-box'>
    <div class='filter-select-box'>
      <div class='property-selector'>
        <div class='label'>Type</div>
        <div class='boxes-list-columns'>
          <div class='boxes-list' v-for="(categorySublist, index) in groupedCategories" :key='index'>
            <div
                :class="[{active: currentCategory === category}, 'item']"
                v-for="category in categorySublist"
                @click.prevent='() => selectCategory(category)'
                :key='category'
            >
              <component :is='inlineCategorySVG[category]' class='icon'/>
            </div>
          </div>
        </div>
      </div>
      <TransitionGroup name='filter-selector'>
        <div class='property-splitter' v-if='showOrders'/>
        <div class='property-selector' v-if='showOrders'>
          <div class='label'>Order</div>
          <div class='boxes-list'>
            <div
                :class="[{active: currentOrder.toString() === order.toString()}, 'item']"
                v-for="order in orders"
                @click.prevent='() => selectOrder(order)'
                :key='order'
            >
              {{formatCategory(order)}}
            </div>
          </div>
        </div>
      </TransitionGroup>
      <TransitionGroup name='filter-selector'>
        <div class='property-splitter' v-if='showTypes'/>
        <div class='property-selector' v-if='showTypes'>
          <div class='label'>Slope</div>
          <div class='texts-list'>
            <div
                :class="[{active: currentType === type}, 'item']"
                v-for="type in types"
                @click.prevent='() => selectType(type)'
                :key='type'
            >
              {{typeLabel(type)}}
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <div class='control-group-splitter'/>
    <FilterControlKnobs :filter='props.filter' :position='props.position' :key='props.filter.id' />
    <div class='control-group-splitter'/>
    <div class='control-bar'>
      <div class='buttons'>
        <div class='current-category'>
          <component :is='inlineCategorySVG[currentCategory]' />
        </div>
        <div class='move-buttons'>
          <div class='btn' @click.prevent="() => eqStore.moveFilterToLeft(props.position)">
            <MoveLeftIcon/>
          </div>
          <div class='btn' @click.prevent="() => eqStore.moveFilterToRight(props.position)">
            <MoveRightIcon/>
          </div>
        </div>
        <div class='btn border-btn remove-btn' @click.prevent='() => eqStore.removeFilter(props.position)'>
          <CloseIcon/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.control-bar {
  width: 26px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  margin: 6px;
  justify-content: space-around;
}
.control-bar .buttons {
  height: 100%;
  width: 26px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}
.control-bar .separator {
  flex: 1 1;
}
.control-bar .move-buttons {

  border: 1px solid var(--border-color);
  border-radius: 5px;
  overflow: hidden;
}
.control-bar .btn {
  width: 22px;
  height: 22px;
  text-align: center;
  line-height: 22px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: bolder;
}
.control-bar .current-category {
  width: 22px;
  height: 22px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}
.border-btn {
  width: 22px;
  height: 22px;
  line-height: 20px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}
.control-bar .btn {
  background-color: rgba(0,255,255,0.2);
}
.control-bar .btn:hover {
  background-color: rgba(0,255,255,0.8);
}
.control-bar .remove-btn {
  background-color: rgba(255,0,0,0.2);
}
.control-bar .remove-btn:hover {
  background-color: rgba(255,0,0,0.8);
}

.filter-selector-enter-active {
  animation: scale-ex 0.3s;
}
.filter-selector-leave-to {
  animation: scale-ex 0.3s reverse;
}


.knob-box {
  height: 100%;
  border-right: 4px solid var(--border-color);
  border-bottom: 2px solid var(--border-color);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
}
.knob-box:last-of-type {
  border-right: 2px solid var(--border-color);
}

.filter-select-box {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-items: center;
}
.property-selector {
  height: 100%;
  flex: 0 0 auto;
  padding: 0 5px;
  user-select: none;
}
.property-selector .label {
  font-family: sans-serif;
  font-size: small;
  text-align: center;
  padding: 1px 0 0;
  height: 25px;
  line-height: 25px;
  width: 100%;
  margin-bottom: 2px;
}
.property-selector .boxes-list-columns {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.property-selector .boxes-list {
  display: flex;
  height: calc(100% - 25px);
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
}
.property-selector .boxes-list .item {
  display: block;
  width: 24px;
  height: 24px;
  line-height: 22px;
  margin: 2px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
}
.property-selector .boxes-list .item.active {
  border: 1px solid var(--border-color);
  box-shadow: 0 0 2px aqua, inset 0 0 6px aqua;
  cursor: default;
}


.property-selector .texts-list {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  align-items: stretch;
  justify-content: flex-start;
  list-style-type: circle;
  list-style-position: inside;
  border: 1px white solid;
  border-radius: 5px;
  background-color: #404040;
  padding: 2px;
}
.property-selector .texts-list .item {
  display: block;
  margin: 4px 2px;
  border-bottom: 1px solid white;
  overflow: hidden;
  color: white;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  line-height: 14px;
  list-style-type: circle;
}
.property-selector .texts-list .item.active {
  cursor: default;
  background: radial-gradient(farthest-side at 50% 100%, rgba(0,255,255,0.8) 0%, rgba(0,255,255,0.8) 5%, rgba(0,255,255,0) 100%);
}
.property-splitter {
  align-self: center;
  height: 50%;
  width: 1px;
  background-color: var(--border-color);
}
.control-group-splitter {
  align-self: center;
  height: 65%;
  width: 4px;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  margin: 0 4px;
}
</style>