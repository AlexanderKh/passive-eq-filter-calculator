import { Filter, capacitorImpedance, inductorImpedance } from './baseComponents'
import { add, divide, multiply } from 'mathjs'


export class HighPassFirstOrder extends Filter {
  f0;

  c1;

  constructor(initialParams) {
    super();
    this.setParams(initialParams)
  }

  recalculateComponents() {
    this.c1 = 0.159155 / this.getR() / this.f0
  }

  getParams() {
    return {
      f0: this.f0
    }
  }

  setParams({ f0 }) {
    this.f0 = f0 || this.f0
    this.recalculateComponents()
  }

  ownImpedance(omega) {
    return this.c1i(omega)
  }

  measureAndImpedance(omega) {
    const [nextm, nexti] = this.next.measureAndImpedance(omega)
    const impedance = add(nexti, this.ownImpedance(omega))
    const measure = divide(nexti, impedance)

    return [multiply(measure, nextm), impedance]
  }

  c1i(omega) {
    return capacitorImpedance(omega, this.c1)
  }
}

export class HighPassSecondOrder extends Filter {
  f0;

  l1;
  l1r;
  c1;

  constructor() {
    super()
    if (this.constructor === HighPassSecondOrder) {
      throw new Error("HighPassSecondOrder is an abstract class.");
    }
  }

  getParams() {
    return {
      f0: this.f0,
      l1r: this.l1r,
    }
  }

  setParams({ f0, l1r }) {
    this.f0 = f0 != null ? f0 : this.f0
    this.l1r = l1r != null ? l1r : this.l1r
    this.recalculateComponents()
  }

  measureAndImpedance(omega) {
    const [nextm, nexti] = this.next.measureAndImpedance(omega)
    const total_impedance_l1_section = divide(1, add(divide(1, this.l1i(omega)), divide(1, nexti)))
    const impedance = add(total_impedance_l1_section, this.c1i(omega))
    const measure = divide(total_impedance_l1_section, impedance)

    return [multiply(measure, nextm), impedance]
  }

  l1i(omega) {
    return inductorImpedance(omega, this.l1, this.l1r)
  }
  c1i(omega) {
    return capacitorImpedance(omega, this.c1)
  }
}

export class HighPassSecondOrderBessel extends HighPassSecondOrder {
  constructor(initialParams) {
    super();
    this.setParams(initialParams)
  }

  recalculateComponents() {
    this.c1 = 0.1169 / this.getR() / this.f0
    this.l1 = 0.3507 * this.getR() / this.f0
  }
}

export class HighPassSecondOrderButterworth extends HighPassSecondOrder {
  constructor(initialParams) {
    super();
    this.setParams(initialParams)
  }

  recalculateComponents() {
    this.c1 = 0.1125 / this.getR() / this.f0
    this.l1 = 0.2251 * this.getR() / this.f0
  }
}

export class HighPassSecondOrderLinkwitzRiley extends HighPassSecondOrder {
  constructor(initialParams) {
    super();
    this.setParams(initialParams)
  }

  recalculateComponents() {
    this.c1 = 0.0796 / this.getR() / this.f0
    this.l1 = 0.3183 * this.getR() / this.f0
  }
}

export class HighPassSecondOrderVariableQ extends HighPassSecondOrder {
  q;

  constructor(initialParams) {
    super();
    this.setParams(initialParams)
  }

  getParams() {
    return {
      ...super.getParams(),
      q: this.q,
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

const defaultSecondOrderParams = {
  f0: 200,
  l1r: 0
}

export const highPassFilters = [
  {
    info: {
      category: 'highpass',
      order: 1,
      type: 'default'
    },
    klass: HighPassFirstOrder,
    defaultParams: {
      f0: 200
    }
  },
  {
    info: {
      category: 'highpass',
      type: 'bessel',
      order: 2,
    },
    klass: HighPassSecondOrderBessel,
    defaultParams: defaultSecondOrderParams
  },
  {
    info: {
      category: 'highpass',
      type: 'butterworth',
      order: 2,
    },
    klass: HighPassSecondOrderButterworth,
    defaultParams: defaultSecondOrderParams
  },
  {
    info: {
      category: 'highpass',
      type: 'linkwitz-riley',
      order: 2,
    },
    klass: HighPassSecondOrderLinkwitzRiley,
    defaultParams: defaultSecondOrderParams
  },
  {
    info: {
      category: 'highpass',
      type: 'variable-q',
      order: 2,
    },
    klass: HighPassSecondOrderVariableQ,
    defaultParams: {
      ...defaultSecondOrderParams,
      q: 0.707
    }
  }
]
