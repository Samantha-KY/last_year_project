const express = require('express');
const app = express();
// const {pool} = require('./dbConfig');
// const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const memberRoutes = require('./routes/member.routes');
const accountRoutes = require('./routes/account.routes');
// const  authenticate  = require('passport');
const initializePassport = require('./passportConfig');

initializePassport(passport);

app.use(express.json());

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/members/login', checkAuthenticated, (req, res) => {
    res.render("login");
});

app.use('/members', memberRoutes);
app.use('/accounts', accountRoutes);

app.get('/members/dashboard', checkNoAuthenticated, (req, res) => {
    res.render("dashboard", {user: req.user.first_name});
});

app.get('/members/logout', (req, res)=>{
    // req.logout();
    // req.session.destroy();
    // req.flash("success_msg", "you have logged out");
    // res.redirect('/members/login');
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success_msg", "you have logged out");
        res.redirect('/members/login');
      });
});
app.post(
    '/members/login', 
    passport.authenticate("local", {
    successRedirect: '/members/dashboard',
    failureRedirect: '/members/login',
    failureFlash: true
})
);

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/members/dashboard');
    }
    next();
}

function checkNoAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/members/login');
}

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
