window.app.UserModel = class UserModel {
  constructor(ProfileService) {
    this._ProfileService = ProfileService;
  }

  changePassword(request) {
    return this._ProfileService.changePassword(request);
  }

  logout() {
    window.location = '/logout';
  }
};
