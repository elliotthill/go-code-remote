import "dotenv/config"
//Express framework
import express,{Request, Response, NextFunction} from 'express'; //const express = require('express');
//Express session
import session from 'express-session'; //const session = require('express-session');
import connectSessionSequelize from 'connect-session-sequelize'; //const sequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelizeStore = connectSessionSequelize(session.Store);

//Necessary modules
import path from 'path';

import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

//Authentication
import passport from 'passport';
import './server/config/passport.js';

//SPA entry
import routes from './server/routes/index.js';

//Public API
import job from './server/routes/job.js';

//Auth API - MUST BE UNCACHED
import user from './server/routes/user.js';

//CMS ADMIN API - MUST BE UNCACHED
import cms from './server/routes/cms.js';

//Top secret API
import admin from './server/routes/admin.js';

const app = express();


/*
 * ES6 __dirname hack
 */
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



/*
 * Security
 */
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
import {models, sequelize} from './server/models/index.js';

app.use(session({
    secret: '3qwxa8NRIj5oxoY',
    cookie: {
        expires: new Date(today.getFullYear() + 10, today.getMonth(), today.getDate())
    },
    store: new sequelizeStore({
        db: sequelize,
        checkExpirationInterval: 24 * 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
    }),
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client/dist')));

app.post('/api/user/login',
    passport.authenticate('local'),
    function (req: Request, res: Response) {

        let api_response = {meta:{}};

        api_response.meta = {
            'status': 'success'
        };

        res.json(api_response);
    });

app.use('/api/cms', cms);
app.use('/api/user', user);
app.use('/api', job);

app.get('/robots.txt', function (req: Request, res: Response) {

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
app.use(function (req: Request, res: Response, next: NextFunction) {
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
if (app.get('env') === 'development' || app.get('env') === 'docker') {

    console.log('RUNNING IN DEV MODE....');

    // development error handler
    // will print stacktrace
    app.use(function (err:any, req: Request, res: Response, next: NextFunction){

        console.log(err);

        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });


} else if (app.get('env') === 'production' || app.get('env') === 'staging' ) {

    if (app.get('env') === 'production'){
        app.set('view cache', true);
    }

    // no stacktraces leaked to user
    app.use(function (err:any, req: Request, res: Response, next: NextFunction) {
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
export default app;
