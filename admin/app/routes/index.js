module.exports = function(app) {
  require('./main')(app);
  require('./login')(app);
  require('./panel')(app);
};
