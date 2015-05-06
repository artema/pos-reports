window.app.MappingModel = class MappingModel {
  constructor(storageProvider) {
    this.changed = new signals.Signal();

    var self = this;

    this._customers = {};
    this._customersStore = storageProvider('pos_mappings_customers');
    this._customersStore.read().then(data => self._customers = self._parse(data));

    this._items = {};
    this._itemsStore = storageProvider('pos_mappings_items');
    this._itemsStore.read().then(data => self._items = self._parse(data));

    this._locations = {};
    this._locationsStore = storageProvider('pos_mappings_locations');
    this._locationsStore.read().then(data => self._locations = self._parse(data));

    this._staff = {};
    this._staffStore = storageProvider('pos_mappings_staff');
    this._staffStore.read().then(data => self._staff = self._parse(data));
  }

  getCustomer(key) {
    return this._customers[key] || {
      id: key,
      firstName: key,
      lastName: ''
    };
  }

  setCustomers(data) {
    this._customers = this._parse(data);
    this._customersStore.write(data);
    this.changed.dispatch();
  }

  get customerCount() {
    return Object.keys(this._customers).length;
  }

  getItem(key) {
    return this._items[key] || {
      id: key,
      name: key
    };
  }

  setItems(data) {
    this._items = this._parse(data);
    this._itemsStore.write(data);
    this.changed.dispatch();
  }

  get itemCount() {
    return Object.keys(this._items).length;
  }

  getLocation(key) {
    return this._locations[key] || {
      id: key,
      name: key
    };
  }

  setLocations(data) {
    this._locations = this._parse(data);
    this._locationsStore.write(data);
    this.changed.dispatch();
  }

  get locationCount() {
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
    this._staff = this._parse(data);
    this._staffStore.write(data);
    this.changed.dispatch();
  }

  get staffCount() {
    return Object.keys(this._staff).length;
  }

  reset() {
    this._customers = {};
    this._customersStore.clear();

    this._items = {};
    this._itemsStore.clear();

    this._locations = {};
    this._locationsStore.clear();

    this._staff = {};
    this._staffStore.clear();


    this.changed.dispatch();
  }

  _parse(items) {
    if (!items || !items.length) {
      return {};
    }

    return items.reduce((result, item) => {
      result[item.id] = item;
      return result;
    }, {});
  }
};
