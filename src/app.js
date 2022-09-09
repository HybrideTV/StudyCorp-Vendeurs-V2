require('dotenv').config();
require('./strategies/discordstrategy');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const db = require('./database/database');
const path = require('path');
const mongoose = require('mongoose');
// Routes
const authRoute = require('./routes/auth');
const blacklistRoute = require('./routes/blacklist');
const ticketRoute = require('./routes/ticket');
const profileRoute = require('./routes/profile');
const adminRoute = require('./routes/admin');

app.use(session({
    secret: 'some random secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    resave: false,
    name: 'discord.oauth2',
    store: new MongoStore({ mongooseConnection:  mongoose.connection })
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use('/auth', authRoute);
app.use('/blacklist', blacklistRoute);
app.use('/ticket', ticketRoute);
app.use('/profile', profileRoute)
app.use('/admin', adminRoute);

app.get('/', isAuthorized, (req, res) => {
    res.render('home');
});

function isAuthorized(req, res, next) {
    if(req.user) {
        console.log("User is logged in.");
        res.redirect('/blacklist');
    }
    else {
        console.log("User is not logged in.");
        next();
    }
}

app.listen(PORT, () => console.log(`Now listening to requests on port ${PORT}`));