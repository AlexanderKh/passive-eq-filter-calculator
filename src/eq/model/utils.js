import { pi } from 'mathjs'

export function hzToRadPerSecond(hz) {
  return hz * 2 * pi
}
export function timesToDB(times) {
  return 20 * Math.log10(times)
}
export function dbToTimes(db) {
  return (10 ** (db / 20))
}
export function radiansToDeg(radians) {
  return radians * 180 / pi
}