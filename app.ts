//Express framework
const express = require('express');

//Express session
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);

//Necessary modules
const path = require('path');
const favicon = require('serve-favicon');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');

//Authentication
const passport = require('passport');
const passportConfig = require('./server/config/passport');


//SPA entry
const routes = require('./server/controller/index');
//Public API
const api = require('./server/controller/api');

//Auth API - MUST BE UNCACHED
const user = require('./server/controller/user');

//CMS ADMIN API - MUST BE UNCACHED
const cms = require('./server/controller/cms');

//Top secret API
const admin = require('./server/controller/admin');

const app = express();


/*
 * Security
 */

//Obfuscation
//var helmet = require('helmet');
//app.use(helmet());

//Template Rendering
app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'pug');

app.set('node_modules', path.join(__dirname, 'client/node_modules'));

//Favicon
app.use(favicon(path.join(__dirname, 'client', '/assets/images/favicon.ico')));

app.use(bodyParser.json({limit:1024*1024*20}));
app.use(bodyParser.urlencoded({extended:true,limit:1024*1024*20}));
app.use(cookieParser());



let today = new Date();
const models = require('./server/models/index');

app.use(session({
    secret: '3qwxa8NRIj5oxoY',
    cookie: {
        expires: new Date(today.getFullYear() + 10, today.getMonth(), today.getDate())
    },
    store: new sequelizeStore({
        db: models.sequelize,
        checkExpirationInterval: 24 * 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
    }),
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'client')));

app.post('/api/user/login',
    passport.authenticate('local'),
    function (req: any, res: { json: (arg0: {}) => void; }) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        let api_response = {meta:{}};
        api_response.meta = {
            'status': 'success'
        };
        res.json(api_response);
    });

app.use('/api/cms', cms);
app.use('/api/user', user);
app.use('/api', api);


app.get('/robots.txt', function (req: any, res: { type: (arg0: string) => void; send: (arg0: string) => void; }) {
    res.type('text/plain');
    if (app.get('env') === 'production') {
        res.send("User-agent: *\nDisallow: /admin/");
    } else {
        res.send("User-agent: *\nDisallow: /");
    }
});


/*
 * Routes
 */
app.use('/', routes);
app.use('/register', routes);
app.use('/login', routes);
app.use('/jobs/', routes);

app.use('/admin/', admin);
app.use('/admin/*', admin);

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: (arg0: Error) => void) {
    let err:any = new Error('Not Found');
    err.status = 404;

    next(err);
});

//Expose user info in all views
//Probably will just cache all templates going forward so useless
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// error handlers
if (app.get('env') === 'development') {

    console.log('RUNNING IN DEV MODE....');

    // development error handler
    // will print stacktrace
    app.use(function (err: { status: any; message: any; }, req: any, res: {
        status: (arg0: any) => void;
        render: (arg0: string, arg1: { message: any; error: any; }) => void;
    }, next: any) {

        console.log(err);

        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));

} else if (app.get('env') === 'production' || app.get('env') === 'staging' ) {

    if (app.get('env') === 'production'){
        app.set('view cache', true);

    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err: { status: any; }, req: any, res: {
        status: (arg0: any) => void;
        render: (arg0: string, arg1: { message: string; error: {}; }) => void;
    }, next: any) {
        res.status(err.status || 500);
        res.render('error', {
            message: 'OOPS. You broke something.',
            error: {}
        });
    });
} else {

    throw new Error('You must specify an environment');
}

//All done
module.exports = app;
