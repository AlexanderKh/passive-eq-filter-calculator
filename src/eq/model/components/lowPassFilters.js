import { Filter, inductorImpedance, capacitorImpedance } from './baseComponents'
import { add, divide, multiply } from 'mathjs'

export class LowPassFirstOrder extends Filter {
  f0

  l1
  l1r

  constructor(initialParams) {
    super()
    this.setParams(initialParams)
  }

  recalculateComponents() {
    this.l1 = 0.159155 * this.getR() / this.f0
  }

  getParams() {
    return {
      f0: this.f0,
      l1r: this.l1r
    }
  }

  setParams({ f0, l1r }) {
    this.f0 = f0 || this.f0
    this.l1r = l1r != null ? l1r : this.l1r
    this.recalculateComponents()
  }

  ownImpedance(omega) {
    return this.l1i(omega)
  }

  measureAndImpedance(omega) {
    const [nextm, nexti] = this.next.measureAndImpedance(omega)
    const impedance = add(nexti, this.ownImpedance(omega))
    const measure = divide(nexti, impedance)

    return [multiply(measure, nextm), impedance]
  }

  l1i(omega) {
    return inductorImpedance(omega, this.l1, this.l1r)
  }
}


export class LowPassSecondOrder extends Filter {
  f0

  l1
  l1r
  c1

  constructor() {
    super()
    if (this.constructor === LowPassSecondOrder) {
      throw new Error("LowPassSecondOrder is an abstract class.");
    }
  }

  getParams() {
    return {
      f0: this.f0,
      l1r: this.l1r
    }
  }

  setParams({ f0, l1r }) {
    this.f0 = f0 != null ? f0 : this.f0
    this.l1r = l1r != null ? l1r : this.l1r
    this.recalculateComponents()
  }

  measureAndImpedance(omega) {
    const [nextm, nexti] = this.next.measureAndImpedance(omega)
    const total_impedance_c1_section = divide(1, add(divide(1, this.c1i(omega)), divide(1, nexti)))
    const impedance = add(total_impedance_c1_section, this.l1i(omega))
    const measure = divide(total_impedance_c1_section, impedance)

    return [multiply(measure, nextm), impedance]
  }

  l1i(omega) {
    return inductorImpedance(omega, this.l1, this.l1r)
  }

  c1i(omega) {
    return capacitorImpedance(omega, this.c1)
  }
}

export class LowPassSecondOrderBessel extends LowPassSecondOrder {
  constructor(initialParams) {
    super()
    this.setParams(initialParams)
  }

  recalculateComponents() {
    this.c1 = 0.0722 / this.getR() / this.f0
    this.l1 = 0.2167 * this.getR() / this.f0
  }
}

export class LowPassSecondOrderButterworth extends LowPassSecondOrder {
  constructor(initialParams) {
    super()
    this.setParams(initialParams)
  }

  recalculateComponents() {
    this.c1 = 0.1125 / this.getR() / this.f0
    this.l1 = 0.2251 * this.getR() / this.f0
  }
}

export class LowPassSecondOrderLinkwitzRiley extends LowPassSecondOrder {
  constructor(initialParams) {
    super()
    this.setParams(initialParams)
  }

  recalculateComponents() {
    this.c1 = 0.0796 / this.getR() / this.f0
    this.l1 = 0.3183 * this.getR() / this.f0
  }
}

export class LowPassSecondOrderVariableQ extends LowPassSecondOrder {
  q

  constructor(initialParams) {
    super()
    this.setParams(initialParams)
  }

  getParams() {
    return {
      ...super.getParams(),
      q: this.q
    }
  }

  setParams({ q, ...others }) {
    this.q = q != null ? q : this.q
    super.setParams(others)
  }

  recalculateComponents() {
    this.l1 = 0.1592 * this.getR() / this.q / this.f0
    this.c1 = 0.1592 * this.q / this.getR() / this.f0
  }
}

const defaultParams = {
  f0: 2000,
  l1r: 0
}

export const lowPassFilters = [
  {
    info: {
      category: 'lowpass',
      order: 1,
      type: 'default'
    },
    klass: LowPassFirstOrder,
    defaultParams: defaultParams
  },
  {
    info: {
      category: 'lowpass',
      order: 2,
      type: 'bessel'
    },
    klass: LowPassSecondOrderBessel,
    defaultParams: defaultParams
  },
  {
    info: {
      category: 'lowpass',
      order: 2,
      type: 'butterworth'
    },
    klass: LowPassSecondOrderButterworth,
    defaultParams: defaultParams
  },
  {
    info: {
      category: 'lowpass',
      order: 2,
      type: 'linkwitz-riley'
    },
    klass: LowPassSecondOrderLinkwitzRiley,
    defaultParams: defaultParams
  },
  {
    info: {
      category: 'lowpass',
      order: 2,
      type: 'variable-q'
    },
    klass: LowPassSecondOrderVariableQ,
    defaultParams: {
      ...defaultParams,
      q: 0.707
    }
  }
]