module.exports = function(app) {
  app.use(require('express').static('./public'));
  app.use('/public', require('express').static('./public'));
  app.use(require('morgan')('dev'));
  app.use(require('cookie-parser')());
  app.use(require('body-parser').json());
  app.use(require('body-parser').urlencoded({extended: true}));

  app.set('trust proxy', true);
};
