var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connflash = require('connect-flash');

const session = require('express-session');
const formidable = require('formidable');
const fs = require('fs');

//const db = require('model/db')();


var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');

var app = express();

var text_msg = "he-he";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(session({
    secret: 'loftschool',
    key: 'key',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: null
    },
    saveUninitialized: false,
    resave: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler

app.use(function (req, res, next) {
    // next(createError(404));
    res.render('index', {title: 'Express'});
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

/*
app.listen(3000, function () {
    console.log('Server start 3000');
});
*/