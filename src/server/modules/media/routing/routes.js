module.exports = app => {
  require('./api/routes')(app);
  require('./pages/routes')(app);
};
