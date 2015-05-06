window.app.ProfileService = class ProfileService {
  constructor($resource) {
    this._api = {
      'changePassword': $resource('/api/profile/change-password', {}, { query: { method: 'POST' } })
    };
  }

  changePassword(request) {
    return this._api.changePassword.query(request).$promise;
  }
};
