import { complex, divide } from 'mathjs'

let id = 1
function getId() {
  return id++
}

class Component {
  constructor() {
    if (this.constructor === Component) {
      throw new Error("Component is an abstract class.");
    }
  }

  // Returns load resistance
  getR() {
    throw new Error("Method getR() must be implemented.");
  }

  // Returns measurement and load impedance at omega
  measureAndImpedance(omega) { // eslint-disable-line
    throw new Error("Method measureAndImpedance() must be implemented.");
  }
}

export class Source extends Component {
  next;

  constructor() {
    super()
  }

  measureAndImpedance(omega) {
    return this.next.measureAndImpedance(omega)
  }

  getR() {
    return this.next ? this.next.getR() : 999999
  }
}

export class Load extends Component {
  previous;

  constructor(r) {
    super()
    this.r = r
  }

  measureAndImpedance() {
    return [complex(1, 0), complex(this.r,0)]
  }

  getR() {
    return this.r
  }
}

export class Filter extends Component {
  next;
  previous;
  id;

  constructor() {
    super()
    this.id = getId()
    if (this.constructor === Filter) {
      throw new Error("Filter is an abstract class.");
    }
  }

  getR() {
    return this.next ? this.next.getR() : 1
  }

  // Returns params to be displayed on UI
  getParams() {
    throw new Error("Method getParams() must be implemented.");
  }

  // Updates params from UI
  setParams(newParams) { // eslint-disable-line
    throw new Error("Method setParams() must be implemented.");
  }

  // Recalculates electrical components
  recalculateComponents() {
    throw new Error("Method recalculateComponents() must be implemented.");
  }
}

export function inductorImpedance(omega, l, lr) {
  return complex(lr, l * omega)
}
export function capacitorImpedance(omega, c) {
  return divide(1, complex(0, omega * c))
}