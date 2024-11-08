import { dbToTimes } from './utils'

export class InitialResponse {
  constructor({ frequencies, measures, phases }) {
    this.frequencies = frequencies
    this.measuresDB = measures
    this.phases = phases
    this.normalizedMeasuresInTimes = null
    this.normalizeMeasures()
  }

  clear() {
    this.frequencies = null
    this.measuresDB = null
    this.phases = null
    this.normalizedMeasuresInTimes = null
  }

  NORMALIZATION_DB_LIMIT = 12

  normalizeMeasures() {
    // Set maximum measure to 0 DB
    const maxMeasure = Math.max(...this.measuresDB);
    const normalizedMeasuresInDB = this.measuresDB.map((measure) => measure - maxMeasure)

    // Make it align around 0 DB
    const dbBucket = Array(this.NORMALIZATION_DB_LIMIT).fill(0)
    normalizedMeasuresInDB.forEach((measure) => {
      const roundedMeasure = Math.round(measure)
      if (-roundedMeasure < this.NORMALIZATION_DB_LIMIT) {
        dbBucket[-roundedMeasure]++
      }
    })
    // index of maximum element
    const selectedDBBucket = dbBucket.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)
    const normalizedMeasuresWithOffsetInDB = normalizedMeasuresInDB.map((measure) => measure + selectedDBBucket)

    this.normalizedMeasuresInTimes = normalizedMeasuresWithOffsetInDB.map((measure) => dbToTimes(measure))
  }

  valueAt(hz) {
    let resultDB = 0
    let resultPhase = 0

    // values at nearest initial response measurement
    let lastDelta
    this.frequencies.some((item, index) => {
      const delta = Math.abs(hz - item)
      if (delta >= lastDelta) {
        return true
      }

      resultDB = this.normalizedMeasuresInTimes[index]
      resultPhase = this.phases[index]

      lastDelta = delta
    });

    return { db: resultDB, deg: resultPhase };
  }
}