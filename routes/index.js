var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');
const config = require('../email_config.json');
const db = require('../model/db')();


/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(" get index ...");
    res.render('index', {
        title: 'Express',
        textmsg: '123',
        products: db.stores.products.store,
        skills: db.stores.skills.store
    });
});

/* POST users listing. */
router.post('/', function (req, res, next) {
    console.log("email=" + req.body.email + "; name=" + req.body.name + '; msg:'+ req.body.message+';');

    //требуем наличия имени, обратной почты и текста
    if (!req.body.name || !req.body.email || !req.body.message) {
        //если что-либо не указано - сообщаем об этом
        return res.json({msg: 'Все поля нужно заполнить!', status: 'Error'});
    }

    //инициализируем модуль для отправки писем и указываем данные из конфига
    let smtpTransport;
    try {
        smtpTransport = nodemailer.createTransport(config.mail.smtp);

    } catch (e) {
        return console.log('Error: ' + e.name + ":" + e.message);
    }
    console.log('SMTP Configured');

    const mailOptions = {
        from: `${req.body.name} <${req.body.email}>`,
        to: config.mail.smtp.auth.user,
        subject: config.mail.subject,
        text:
        req.body.message.trim().slice(0, 500) +
        `\n Отправлено с: <${req.body.email}>`
    };
    console.log('mailOptions Configured');


    //отправляем почту
    console.log('Start sending Mail ... ');

    smtpTransport.sendMail(mailOptions, function (error, response) {
        //если есть ошибки при отправке - сообщаем об этом
        if (error) {
            console.log(error);
            return res.json({msg: `При отправке письма произошла ошибка!: ${error}`, status: 'Error'});
        } else {
            console.log("Message sent: " + response.message);
            console.log('Message sent: %s', response.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(response));

            res.json({msg: 'Письмо успешно отправлено!', status: 'Ok'});
            res.redirect('/?msg=Письмо успешно отправлено!');
        }
        smtpTransport.close();
    });
    res.redirect('/?msg=SEND-MAIL');
});


module.exports = router;
