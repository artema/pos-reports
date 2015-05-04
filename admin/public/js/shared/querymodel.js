window.app.QueryModel = class QueryModel {
  constructor() {
    this.changed = new signals.Signal();

    this._now = moment().date(1);
    this._days = moment().endOf('month').date();
  }

  get query() {
    return {
      date: this._now.format('YYYY-MM-DD'),
      year: this.year,
      month: this.month,
      day: this.day,
      days: this.days
    };
  }

  set year(value) {
    this._now.year(value);
    this.changed.dispatch(query);
  }

  get year() {
    return this._now.year();
  }

  set month(value) {
    this._now.month(value);
    this.changed.dispatch(query);
  }

  get month() {
    return this._now.month();
  }

  set day(value) {
    this._now.date(value);
    this.changed.dispatch(query);
  }

  get day() {
    return this._now.date();
  }

  set days(value) {
    this._days = value;
    this.changed.dispatch(query);
  }

  get days() {
    return this._days;
  }
};
