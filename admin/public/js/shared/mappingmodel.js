window.app.MappingModel = class MappingModel {
  constructor(storageProvider) {
    this.changed = new signals.Signal();

    var self = this;

    this._customers = {};
    this._customersStore = storageProvider('pos_mappings_customers');
    this._customersStore.read(data => self._customers = data || self._customers);

    this._items = {};
    this._itemsStore = storageProvider('pos_mappings_items');
    this._itemsStore.read(data => self._items = data || self._items);

    this._locations = {};
    this._locationsStore = storageProvider('pos_mappings_locations');
    this._locationsStore.read(data => self._locations = data || self._locations);

    this._staff = {};
    this._staffStore = storageProvider('pos_mappings_staff');
    this._staffStore.read(data => self._staff = data || self._staff);
  }

  getCustomer(key) {
    return this._customers[key] || {
      id: key,
      firstName: key,
      lastName: ''
    };
  }

  setCustomers(data) {
    this._customersStore.write(this._customers = data);
    this.changed.dispatch();
  }

  customerCount() {
    return Object.keys(this._customers).length;
  }

  getItem(key) {
    return this._items[key] || {
      id: key,
      name: key
    };
  }

  setItems(data) {
    this._itemsStore.write(this._items = data);
    this.changed.dispatch();
  }

  itemCount() {
    return Object.keys(this._items).length;
  }

  getLocation(key) {
    return this._locations[key] || {
      id: key,
      name: key
    };
  }

  setLocations(data) {
    this._locationsStore.write(this._locations = data);
    this.changed.dispatch();
  }

  locationCount() {
    return Object.keys(this._locations).length;
  }

  getStaff(key) {
    return this._staff[key] || {
      id: key,
      firstName: key,
      lastName: ''
    };
  }

  setStaff(data) {
    this._staffStore.write(this._staff = data);
    this.changed.dispatch();
  }

  staffCount() {
    return Object.keys(this._staff).length;
  }
};
