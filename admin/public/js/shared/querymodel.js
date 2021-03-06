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
    if (this._now.year() === value) { return; }
    this._now.year(value);
    this.changed.dispatch(this.query);
  }

  get year() {
    return this._now.year();
  }

  set month(value) {
    if (this._now.month() === value) { return; }
    this._now.month(value);
    this.changed.dispatch(this.query);
  }

  get month() {
    return this._now.month();
  }

  set day(value) {
    if (this._now.date() === value) { return; }
    this._now.date(value);
    this.changed.dispatch(this.query);
  }

  get day() {
    return this._now.date();
  }

  set days(value) {
    if (this._days === value) { return; }
    this._days = value;
    this.changed.dispatch(this.query);
  }

  get days() {
    return this._days;
  }
};
