window.app.Store = class Store {
  constructor() {
    this._storage = null;
  }

  clear() {
    this._storage = null;
    return Promise.resolve();
  }

  read() {
    var self = this;
    return new Promise(resolve => {
      resolve(self._storage);
    });
  }

  write(value) {
    var self = this;
    return new Promise(resolve => {
      self._storage = value;
      resolve();
    });
  }
};
