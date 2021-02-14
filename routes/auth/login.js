const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('../../schemas/User');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
    res.status(200).render('login');
});

router.post('/', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log({
        username,
        password
    })

    const payload = req.body;

    const user = await User.findOne({
        $or: [
            { email : username },
            { username }
        ]
    }).catch(err => {
        console.log(err);
        payload.errorMessage = "Something went wrong";
        return res.status(200).render('login', payload);
    });

    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            return res.redirect('/');
        }
    }
    
    payload.errorMessage = "Username/password combination do not match";
    return res.status(200).render('login', payload);
});

module.exports = router;