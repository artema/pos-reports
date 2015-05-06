window.app.UserModel = class UserModel {
  constructor(ProfileService) {
    this._ProfileService = ProfileService;
  }

  getProfile() {
    return this._ProfileService.getProfile();
  }

  changePassword(request) {
    return this._ProfileService.changePassword(request);
  }

  signUp(request) {
    return this._ProfileService.signUp(request);
  }

  generateAuthToken() {
    return this._ProfileService.generateAuthToken();
  }

  logout() {
    window.location = '/logout';
  }
};
