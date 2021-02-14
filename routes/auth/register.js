const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/User');
const bcrypt = require('bcrypt');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
    res.status(200).render('register');
});

router.post('/', async (req, res, next) => {
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    let payload = req.body;

    if (firstName && lastName && username && email && password) {
        const user = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        }).catch(err => {
            console.log(err);
            payload.errorMessage = "Something Went Wrong!";
            return res.status(200).render('register', payload);
        });

        if (user) {
            if (user.email == email) {
                payload.errorMessage = "Email already Exists";
            } else {
                payload.errorMessage = "Username already Exists";
            }
            return res.status(200).render('register', payload);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        }).then(user => {
            console.log({ user });
            req.session.user = user;
            return res.redirect('/');
        }).catch(err => {
            console.log(err);
            payload.errorMessage = "Something Went Wrong!";
            return res.status(200).render('register', payload);
        });
    } else {
        payload.errorMessage = "Make sure each field has valid value.";
        res.status(200).render('register', payload);
    }
});

module.exports = router;