import { Filter, capacitorImpedance, inductorImpedance } from './baseComponents'
import { add, divide, multiply, pi } from 'mathjs'
import { dbToTimes } from '../utils'

class SimpleNotchOrBandPass extends Filter {
  f0;
  q;

  l1;
  l1r;
  c1;

  constructor(initialParams) {
    super();
    this.setParams(initialParams)
    if (this.constructor === SimpleNotchOrBandPass) {
      throw new Error("SimpleBell is an abstract class.");
    }
  }

  getParams() {
    return {
      f0: this.f0,
      q: this.q,
    }
  }

  setParams({ f0, q, l1r }) {
    this.f0 = f0 != null ? f0 : this.f0
    this.q = q != null ? q : this.q
    this.l1r = l1r != null ? l1r : this.l1r
    this.recalculateComponents()
  }

  l1i(omega) {
    return inductorImpedance(omega, this.l1, this.l1r)
  }
  c1i(omega) {
    return capacitorImpedance(omega, this.c1)
  }
}

export class SimpleNotch extends SimpleNotchOrBandPass {
  constructor(initialParams) {
    super(initialParams);
  }

  recalculateComponents() {
    this.l1 = 10 * (1 / this.q) / pi / this.f0
    this.c1 = 0.025 / (1 / this.q) / pi / this.f0
  }

  measureAndImpedance(omega) {
    const [nextm, nexti] = this.next.measureAndImpedance(omega)
    const ownImpedance = divide(1, add(divide(1, this.l1i(omega)), divide(1, this.c1i(omega))))
    const impedance = add(nexti, ownImpedance)
    const measure = divide(nexti, impedance)

    return [multiply(measure, nextm), impedance]
  }
}

export class SimpleBandPass extends SimpleNotchOrBandPass {
  constructor(initialParams) {
    super(initialParams);
  }

  recalculateComponents() {
    this.l1 = 2.5 * this.q / pi / this.f0
    this.c1 = 0.1 / this.q / pi / this.f0
  }

  measureAndImpedance(omega) {
    const [nextm, nexti] = this.next.measureAndImpedance(omega)
    const ownImpedance = add(this.l1i(omega), this.c1i(omega))
    const impedance = add(nexti, ownImpedance)
    const measure = divide(nexti, impedance)

    return [multiply(measure, nextm), impedance]
  }
}

class SimpleBell extends SimpleNotchOrBandPass {
  db;
  r;

  constructor(initialParams) {
    super(initialParams);
    this.setParams(initialParams)
    if (this.constructor === SimpleNotchOrBandPass) {
      throw new Error("SimpleBell is an abstract class.");
    }
  }

  getParams() {
    return {
      ...super.getParams(),
      db: this.db,
    }
  }

  setParams({ db, ...rest }) {
    this.db = db != null ? db : this.db
    super.setParams(rest)
  }
}

export class SimpleBellDown extends SimpleBell {
  constructor(initialParams) {
    super(initialParams);
  }

  recalculateComponents() {
    this.r = this.getR() * dbToTimes(parseFloat(this.db)) - this.getR()
    this.l1 = 0.5 * (1 / this.q) * (this.r + this.l1r) / pi / this.f0
    this.c1 = 0.5 / (1 / this.q) / (this.r + this.l1r) / pi / this.f0
  }

  measureAndImpedance(omega) {
    const [nextm, nexti] = this.next.measureAndImpedance(omega)
    const ownImpedance = divide(1, add(add(divide(1, this.l1i(omega)), divide(1, this.c1i(omega))), divide(1, this.r)))
    const impedance = add(nexti, ownImpedance)
    const measure = divide(nexti, impedance)

    return [multiply(measure, nextm), impedance]
  }
}

export class SimpleBellUp extends SimpleBell {
  constructor(initialParams) {
    super(initialParams);
  }

  recalculateComponents() {
    this.r = this.getR() * dbToTimes(parseFloat(this.db)) - this.getR()
    this.l1 = 0.5 * this.q * (this.r + this.l1r) / pi / this.f0
    this.c1 = 0.5 / this.q / (this.r + this.l1r) / pi / this.f0
  }

  measureAndImpedance(omega) {
    const [nextm, nexti] = this.next.measureAndImpedance(omega)
    const ownImpedance = this.ownImpedance(omega)
    const impedance = add(nexti, ownImpedance)
    const measure = divide(nexti, impedance)

    return [multiply(measure, nextm), impedance]
  }

  ownImpedance(omega) {
    if (this.r === 0) {
      return 0
    }

    const sequenceImpedance = add(this.l1i(omega), this.c1i(omega))
    return divide(multiply(this.r, sequenceImpedance), add(this.r, sequenceImpedance))
  }
}

const defaultNotchPassParams = {
  f0: 1000,
  l1r: 0,
  q: 1,
}
const defaultBellParams = {
  ...defaultNotchPassParams,
  db: 3,
}

export const bellFilters = [
  {
    info: {
      category: 'bell-down',
      order: 1,
      type: 'simple-bell-down'
    },
    klass: SimpleBellDown,
    defaultParams: defaultBellParams
  },
  {
    info: {
      category: 'bell-up',
      order: 1,
      type: 'simple-bell-up'
    },
    klass: SimpleBellUp,
    defaultParams: defaultBellParams
  },
  {
    info: {
      category: 'notch',
      order: 1,
      type: 'simple-notch'
    },
    klass: SimpleNotch,
    defaultParams: defaultNotchPassParams
  },
  {
    info: {
      category: 'bandpass',
      order: 1,
      type: 'simple-bandpass'
    },
    klass: SimpleBandPass,
    defaultParams: defaultNotchPassParams
  },
]