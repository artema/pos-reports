window.app.LocalStorageStore = class LocalStorageStore extends app.Store {
  constructor(id) {
    this._id = id;
  }

  clear() {
    var self = this;
    return new Promise(resolve => {
      store.remove(self._id);
      resolve();
    });
  }

  read() {
    var self = this;
    return new Promise(resolve => {
      resolve(store.get(self._id));
    });
  }

  write(value) {
    var self = this;
    return new Promise(resolve => {
      store.set(self._id, value);
      resolve();
    });
  }
};
