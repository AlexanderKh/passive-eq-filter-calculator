import { abs, arg } from 'mathjs'
import { Load, Source } from './components/baseComponents'
import { allFilters, defaultFilter } from './filterCollection'
import { hzToRadPerSecond, timesToDB, radiansToDeg } from './utils'
import { InitialResponse } from './initialResponse'

export class Model {
  chain = []
  initialResponse = null
  initialResponseVisible = false

  constructor(loadR) {
    this.source = new Source()
    this.load = new Load(loadR)

    this.load.previous = this.source
    this.source.next = this.load
  }

  hasInitialResponse() {
    return !!this.initialResponse
  }

  clearInitialResponse() {
    if (this.hasInitialResponse()) {
      this.initialResponse.clear()
      this.initialResponse = null
      this.initialResponseVisible = false
    }
  }

  setInitialResponse(data) {
    console.log('setInitialResponse');
    this.initialResponse = new InitialResponse(data);
    this.initialResponseVisible = true
  }

  getInitialResponseVisible() {
    return this.initialResponseVisible
  }

  setInitialResponseVisible(newValue) {
    this.initialResponseVisible = newValue
  }

  addFilter() {
    this._addToChain(this._createFilterChainElement(defaultFilter))
  }

  moveFilterToLeft(postion) {
    if (postion === 0) {
      return
    }

    this._moveFilter(postion - 1, postion)
  }

  moveFilterToRight(postion) {
    if (postion === this.chain.length - 1) {
      return
    }

    this._moveFilter(postion, postion + 1)
  }

  changeFilter(position, newFilterName) {
    const newFilterData = allFilters.find((filterData) => filterData.info.name === newFilterName)
    if (!newFilterData) {
      throw new Error(`Cannot find filter ${newFilterName}`)
    }

    this.removeOrReplaceFromChain(position, this._createFilterChainElement(newFilterData))
  }

  removeOrReplaceFromChain(position, newChainElement = null) {
    const chainLength = this.chain.length
    if (position >= chainLength || position < 0) {
      throw new Error(`Invalid position ${position}`)
    }

    const oldInstance = this.chain[position].instance
    oldInstance.next = null
    oldInstance.previous = null

    if (newChainElement) {
      const { instance } = newChainElement
      this._copyParams(oldInstance, instance)
      this.chain[position] = newChainElement
    } else {
      this.chain.splice(position, 1);
    }

    this._reconnect()
  }

  removeAllFilters() {
    this.chain = []
    this._reconnect()
  }

  measure({ start = 20, end = 20000, precision = 0.01 }) {
    const result = []
    const startLog = Math.log10(start)
    const endLog = Math.log10(end) + precision
    for (let hzLog = startLog; hzLog <= endLog; hzLog += precision) {
      const realHz = 10 ** hzLog
      result.push(this._measureAt(realHz))
    }

    return result
  }

  setFilterParams(position, newParams) {
    const instance = this.chain[position].instance
    instance.setParams({ ...instance.getParams(), ...newParams })
  }

  getCurrentFiltersWithParams() {
    return this.chain.map((chainElement) => {
      return {
        id: chainElement.instance.id,
        orderId: chainElement.instance.orderId,
        instance: chainElement.instance,
        info: chainElement.info,
        params: chainElement.instance.getParams()
      }
    })
  }

  setR(newR) {
    this.load.r = newR
    this._recalculate()
  }

  _measureAt(hz) {
    const omega = hzToRadPerSecond(hz)
    // eslint-disable-next-line
    const [measure, impedance] = this.source.measureAndImpedance(omega)

    let initialPowerMeasure = 1
    let initialPhaseMeasure = 0
    if (this.hasInitialResponse() && this.initialResponseVisible) {
      const { db, deg } = this.initialResponse.valueAt(hz)
      initialPowerMeasure = db
      initialPhaseMeasure = deg
    }

    const powerMeasure = abs(measure)
    const phaseMeasure = radiansToDeg(arg(measure))
    const finalPowerMeasure = powerMeasure * initialPowerMeasure
    const finalPhaseMeasure = phaseMeasure + initialPhaseMeasure

    return {
      f: hz,
      db: timesToDB(finalPowerMeasure),
      deg: finalPhaseMeasure,
    }
  }

  _moveFilter(leftPosition, rightPosition) {
    const left = this.chain[leftPosition]
    const right = this.chain[rightPosition]

    this.chain[leftPosition] = right
    this.chain[rightPosition] = left

    this._reconnect()
  }

  _copyParams(oldInstance, newInstance) {
    const { f0 = null } = oldInstance.getParams()
    newInstance.setParams({ f0 })
    newInstance.orderId = oldInstance.orderId
  }

  _createFilterChainElement(filterData) {
    const filter = new filterData.klass(filterData.defaultParams)
    filter.orderId = filter.id
    return { instance: filter, info: filterData.info }
  }

  _addToChain(chainElement) {
    this.chain.push(chainElement)
    this._reconnect()
  }

  _reconnect() {
    if (this.chain.length === 0) {
      this.source.next = this.load
      this.load.previous = this.source
    } else {
      const lastIndex = this.chain.length - 1
      this.chain.forEach((chainElement, index) => {
        const { instance } = chainElement
        const previousInstance = index === 0 ? this.source : this.chain[index - 1].instance
        const nextInstance = index === lastIndex ? this.load : this.chain[index + 1].instance

        previousInstance.next = instance
        instance.previous = previousInstance
        instance.next = nextInstance
        nextInstance.previous = instance
      })

      this._recalculate()
    }
  }

  _recalculate() {
    this.chain.forEach((chainElement) => chainElement.instance.recalculateComponents())
  }
}