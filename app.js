const express = require('express');
const app = express();
require('dotenv').config();
const { requireLogin } = require('./middlewares');
const PORT = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./database');
const session = require('express-session');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

// Routes
const loginRoutes = require('./routes/auth/login');
const registerRoutes = require('./routes/auth/register');
const logoutRoutes = require('./routes/auth/logout');

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/logout', logoutRoutes);

app.get('/', requireLogin, (req, res, next) => {
    const payload = {
        pageTitle: 'Home',
        userLoggedIn: req.session.user 
    };

    res.status(200).render('home', payload);
});


const server = app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT);
});