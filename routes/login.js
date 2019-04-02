var express = require('express');
var router = express.Router();
const db = require('../model/db')();

/* POST users listing. */
router.post('/', function (req, res, next) {
    //res.send('respond with a resource (POST) email=' + req.body.email + ' pwd=' + req.body.password);

    const { email, password } = req.body;
    const data = db.stores.login.store;

    console.log("----------------------");
    console.log("email=" + req.body.email + " pwd=" + req.body.password);
    console.log("email=" + data.email + " pwd=" + data.password);
    console.log("----------------------");


    if (email === data.email && password === data.password) {
        req.session.isAdmin = true;
        return res.redirect('/admin');
    }

    return res.redirect('/login/?msgslogin=Wrong email or PWD !! ');

});

/* GET users listing. */
router.get('*', function (req, res, next) {

    if (req.session.isAdmin) {
        return res.redirect('/admin');
    }

    return res.render(`login`, {
        msgslogin: req.query.msgslogin
    });
});


module.exports = router;
