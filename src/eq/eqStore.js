import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Model } from './model/model'

const DEFAULT_VISIBLE_DB_ABOVE_LINE = 3

export const useEQStore = defineStore('eq', () => {
  const frequencyLimits = ref({ start: 20, end: 20000 })
  const filters = ref([])
  const measurement = ref([])
  const loadR = ref(8)
  const minVisibleDB = ref(-18)
  const maxVisibleDB = ref(DEFAULT_VISIBLE_DB_ABOVE_LINE)
  const initialResponseVisible = ref(null)
  const initialResponsePresent = ref(null)

  const model = new Model(loadR.value);

  const loadDataFromModel = () => {
    filters.value = model.getCurrentFiltersWithParams()
    measurement.value = model.measure({start: frequencyLimits.value.start, end: frequencyLimits.value.end})
    initialResponseVisible.value = model.getInitialResponseVisible()
    initialResponsePresent.value = model.hasInitialResponse()
  }
  watch(frequencyLimits.value, () => loadDataFromModel())


  const updateUpperChartLimit = () => {
    let newMaxDBValue = DEFAULT_VISIBLE_DB_ABOVE_LINE
    measurement.value.forEach((measurementElement) => {
      const correctedCurrentDB = measurementElement.db + DEFAULT_VISIBLE_DB_ABOVE_LINE
      if (correctedCurrentDB > newMaxDBValue) {
        newMaxDBValue = correctedCurrentDB
      }
    })
    maxVisibleDB.value = Math.ceil(newMaxDBValue)
  }

  const addFilter = () => {
    model.addFilter()
    loadDataFromModel()
  }
  const moveFilterToLeft = (position) => {
    model.moveFilterToLeft(position)
    loadDataFromModel()
  }
  const moveFilterToRight = (position) => {
    model.moveFilterToRight(position)
    loadDataFromModel()
  }
  const changeFilter = (position, newFilterName) => {
    model.changeFilter(position, newFilterName)
    loadDataFromModel()
  }
  const setFilterParams = (position, newParams) => {
    model.setFilterParams(position, newParams)
    loadDataFromModel()
  }
  const removeFilter = (position) => {
    model.removeOrReplaceFromChain(position)
    loadDataFromModel()
  }
  const removeAllFilters = () => {
    model.removeAllFilters()
    loadDataFromModel()
  }
  const setR = (newR) => {
    const newRNum = Number(newR)
    loadR.value = newRNum
    model.setR(newRNum)
    loadDataFromModel()
  }
  const clearInitialResponse = () => {
    model.clearInitialResponse()
    loadDataFromModel()
    updateUpperChartLimit()
  }
  const setInitialResponse = (data) => {
    model.setInitialResponse(data)
    loadDataFromModel()
    updateUpperChartLimit()
  }
  const setInitialResponseVisible = (newValue) => {
    model.setInitialResponseVisible(newValue)
    loadDataFromModel()
  }


  loadDataFromModel()

  return {
    filters,
    measurement,
    frequencyLimits,
    loadR,
    addFilter,
    changeFilter,
    setFilterParams,
    removeFilter,
    removeAllFilters,
    moveFilterToLeft,
    moveFilterToRight,
    setR,
    setInitialResponse,
    initialResponsePresent,
    initialResponseVisible,
    setInitialResponseVisible,
    clearInitialResponse,
    minVisibleDB,
    maxVisibleDB,
  }
})