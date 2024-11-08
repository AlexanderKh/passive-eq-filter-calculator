import { add, divide, multiply } from 'mathjs'
import { HighPassFirstOrder } from './highPassFilters'
import { LowPassFirstOrder } from './lowPassFilters'
import { dbToTimes } from '../utils'

export const shelfFilterMixin = (Base) =>
  class extends Base {
    db;
    r;

    constructor(initialParams) {
      super(initialParams);
      this.setParams(initialParams)
    }

    recalculateComponents() {
      this.r = this.getR() * dbToTimes(parseFloat(this.db)) - this.getR()
      super.recalculateComponents()
    }

    getParams() {
      return {
        ...super.getParams(),
        db: this.db,
      }
    }

    setParams({ db, ...rest }) {
      this.db = db || this.db
      super.setParams(rest)
    }
  }

const shelfFirstOrderMixin = (Base) =>
  class extends Base {
    ownImpedance(omega) {
      return divide(1, add(divide(1, super.ownImpedance(omega)), divide(1, this.r)))
    }
  }

class HighShelfFirstOrder extends shelfFirstOrderMixin(shelfFilterMixin(HighPassFirstOrder)) {}

class LowShelfFirstOrder extends shelfFirstOrderMixin(shelfFilterMixin(LowPassFirstOrder)) {}

// Leave it for now
// eslint-disable-next-line
const highShelfSecondOrderMixin = (Base) =>
  class extends Base {
    measureAndImpedance(omega) {
      const [nextm, nexti] = this.next.measureAndImpedance(omega)
      const total_impedance_l1_section = divide(1, add(divide(1, this.l1i(omega)), divide(1, nexti)))
      const c1_section_imp = divide(1, add(divide(1, this.c1i(omega)), divide(1, this.r)))
      const impedance = add(total_impedance_l1_section, c1_section_imp)
      const measure = divide(total_impedance_l1_section, impedance)

      return [multiply(measure, nextm), impedance]
    }
  }

export const shelfFilters = [
  {
    info: {
      category: 'highshelf',
      order: 1,
      type: 'default'
    },
    klass: HighShelfFirstOrder,
    defaultParams: {
      db: 3,
      f0: 2000
    }
  },
  {
    info: {
      category: 'lowshelf',
      order: 1,
      type: 'default'
    },
    klass: LowShelfFirstOrder,
    defaultParams: {
      db: 3,
      f0: 200,
      l1r: 0,
    }
  },
]