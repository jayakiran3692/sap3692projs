class Emitter {
  constructor() {
    this.events = {};
  }
  on(name, fn) {
    const list = this.events[name] || [];
    this.events[name] = [...list, fn];
  }
  emit(name, data) {
    const list = this.events[name] || [];
    list.forEach(fn => fn(data));
  }
  off(name) {
    delete this.events[name];
  }
}

module.exports = Emitter;