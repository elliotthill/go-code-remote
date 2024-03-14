var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../models/index');
const bcrypt = require("bcrypt-nodejs");

// Serialize Sessions
passport.serializeUser(function (user, done) {
    done(null, user);
});

//Deserialize Sessions
passport.deserializeUser(function (user, done) {

    models.User.findOne({
        where: {
            id: user.id
        }
    }).then(function (user) {
        done(null, user);
    }).error(function (err) {
        done(err, null)
    });
});

// Authentication
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {

        console.log(email);
        console.log(password);


        models.User.findOne({where:{ email: email}}).then(function (user, err) {

            console.log(err);

            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
            return done(null, user);

        });
    }
));