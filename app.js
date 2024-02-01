var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var cleanCodeRouter = require('./routes/cleancode');
var adatbazisRouter = require('./routes/adatbazis');
var solidRouter = require('./routes/solid');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cleancode', cleanCodeRouter);
app.use('/adatbazis', adatbazisRouter);
app.use('/solid', solidRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const { Sequelize, Model, DataTypes, QueryTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  age: DataTypes.INTEGER,
  os: {
    type: DataTypes.TEXT,
    defaultValue: 'windows'
  },
  activeWorker: DataTypes.BOOLEAN,
  pw: DataTypes.INTEGER,
}, {
  tableName: 'Employees',
  hooks: {
    beforeCreate: (user, options) => {
      if (user.name == 'Admin') {
        throw new Error('Admin user cannot be created');
      }
    },
    afterCreate: (user, options) => {
      console.log('Sikeres adatbázis művelet!');
      console.log(user.name);
      console.log(user.age);
    }
  }
});

(async () => {
  await sequelize.drop();
  await sequelize.sync({ force: true });
  await User.create({ name: "Tamas", age: 39, activeWorker: true, pw: 123 });
  await User.create({ name: "Balazs", age: 25, os: "Linux", activeWorker: true, pw: 456 });
  await User.create({ name: "Anna", age: 45, activeWorker: true, pw: 789 });
  await User.create({ name: "Imre", age: 30, os: "Linux", activeWorker: false, pw: 987 });
})();
