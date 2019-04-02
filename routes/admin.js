var express = require('express');
var router = express.Router();

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../model/db')();


/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.session.isAdmin) {
        res.render('admin', {
            title: 'admin',
            msgskill: req.query.msgskill,
            msg: req.query.msg,
            skills: db.stores.skills.store
        });
    }
    else
        res.redirect('/');

    //res.send('respond with a resource admin GET');
    //res.render('pages/index', {title: 'My upload', msg: req.query.msg, pic: db.stores.file.store});
});

router.get('/logout', function (req, res, next) {
    req.session.isAdmin = false;
    res.redirect('/');
});

router.post('/', function (req, res, next) {
    res.send('respond with a resource admin POST');
});

router.post('/skills', function (req, res, next) {
    if (req.session.isAdmin) {
        let msg = 'age: ' + req.body.age + ' cities:' + req.body.cities + ' concert:' + req.body.concerts + ' years:' + req.body.years;

        const fildsName = ['age', 'concerts', 'cities', 'years'];
        const {age, concerts, cities, years} = req.body;
        const data = db.stores.skills.store;
        let isValid = true;

        [age, concerts, cities, years].forEach((item, i) => {
            const isNotNumber = parseInt(item, 10) === NaN;
            if (item < 0 || isNotNumber) {
                isValid = false;
                return;
            }
            db.stores.skills.store[i].number = item;
        });

        if (!isValid) {
            return res.redirect('/admin/?msgskill=Error');
        }

        db.save();
        return res.redirect('/admin/?msgskill=Счетчики обновлены');
    }
    else
        res.redirect('/');

});

router.post('/upload', function (req, res, next) {
    if (req.session.isAdmin) {
        let form = new formidable.IncomingForm();
        let upload = path.join('./public/images', 'products');
        let fileName;

        if (!fs.existsSync(upload)) {
            fs.mkdirSync(upload);
        }

        form.uploadDir = path.join(process.cwd(), upload);

        form.parse(req, function (err, fields, files) {
            if (err) {
                return next(err);
            }
            if (files.photo.name === '' || files.photo.size === 0) {
                fs.unlink(files.photo.path);
                return res.redirect('/admin?fl=1&msg=Не загружена картинка!');
            }
            if (!fields.name) {
                fs.unlink(files.photo.path);
                return res.redirect('/admin?fl=2&msg=Не указано описание картинки!');
            }

            const isNotNumber = parseInt(fields.price, 10) === NaN;

            fileName = path.join(upload, files.photo.name);
            fs.rename(files.photo.path, fileName, function (err) {
                if (err) {
                    console.error(err);
                    fs.unlink(fileName);
                    fs.rename(files.photo.path, fileName);
                }
                let dir = fileName.substr(fileName.indexOf('\\'));

                db.stores.products.store.push(
                    {
                        'name': fields.name,
                        'price': fields.price,
                        'src': dir
                    }
                );
                db.save();

                res.redirect('/admin?fl=3&msg=Картинка успешно загружена');
            })

        })
    }
    else
        res.redirect('/');

});

module.exports = router;



