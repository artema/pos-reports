window.app.ProfileService = class ProfileService {
  constructor($resource) {
    this._api = {
      'getProfile': $resource('/api/profile', {}, { query: { method: 'GET' } }),
      'changePassword': $resource('/api/profile/change-password', {}, { query: { method: 'POST' } }),
      'signUp': $resource('/api/profile/sign-up', {}, { query: { method: 'POST' } }),
      'generateAuthToken': $resource('/api/profile/generate-auth-token', {}, { query: { method: 'POST' } })
    };
  }

  getProfile() {
    return this._api.getProfile.query().$promise;
  }

  changePassword(request) {
    return this._api.changePassword.query(request).$promise;
  }

  signUp(request) {
    return this._api.signUp.query(request).$promise;
  }

  generateAuthToken() {
    return this._api.generateAuthToken.query().$promise;
  }
};
