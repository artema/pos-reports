window.app.MappingModel = class MappingModel {
  constructor() {
    this.changed = new signals.Signal();
  }

  getCustomer(key) {
    return {
      id: key,
      firstName: key,
      lastName: ''
    };
  }

  getItem(key) {
    return {
      id: key,
      name: key
    };
  }

  getLocation(key) {
    return {
      id: key,
      name: key
    };
  }

  getStaff(key) {
    return {
      id: key,
      firstName: key,
      lastName: ''
    };
  }
};
