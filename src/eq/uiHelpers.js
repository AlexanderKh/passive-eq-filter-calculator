import belldown from '../assets/category-icons/bell-inverse.svg'
import bellup from '../assets/category-icons/bell.svg'
import lowpass from '../assets/category-icons/low-pass.svg'
import highpass from '../assets/category-icons/high-pass.svg'
import lowshelf from '../assets/category-icons/low-shelf.svg'
import highshelf from '../assets/category-icons/high-shelf.svg'
import notch from '../assets/category-icons/notch.svg'
import bandpass from '../assets/category-icons/band-pass.svg'

export const inlineCategorySVG = {
  'bell-down': belldown,
  'bell-up': bellup,
  'lowpass': lowpass,
  'highpass': highpass,
  'lowshelf': lowshelf,
  'highshelf': highshelf,
  'notch': notch,
  'bandpass': bandpass,
}
export const typeLabels = {
  'bessel': 'Bessel',
  'butterworth': 'Butterworth',
  'linkwitz-riley': 'Linkwitz-Riley',
  'variable-q': 'Variable Q',
}
export function typeLabel(type) {
  return typeLabels[type] || type
}