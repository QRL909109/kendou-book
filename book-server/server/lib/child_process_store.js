class ChildProcessStore {
  constructor() {
    this.store = {} // 初始化store
  }

  set(key, data) {

    this.store[key] = this.store[key] ? [...this.store[key], data] : [data]
  }

  clear() {
    this.store = {}
  }

  get(key) {
    return this.store[key]
  }

  all() {
    return this.store
  }
}

exports.childProcessStore = new ChildProcessStore()
