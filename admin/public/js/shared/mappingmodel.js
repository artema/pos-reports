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
