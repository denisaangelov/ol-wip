/**
 * This file provided by IPT-Intellectual Products & Technologies (IPT)
 * is for non-commercial testing and evaluation purposes only. 
 * IPT reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict';

var sqlite3 = require('sqlite3').verbose();
const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const paths = require('../config/paths');
const rootPath = paths.root;
const routes_users = require('./routes/users');
const routes_markers = require('./routes/markers');
// const fs = require('fs');


const app = express();
app.set('app', path.join(rootPath, 'app'));

// uncomment after placing your favicon in /public
//app.use(favicon(dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(rootPath, 'app/assets')));

app.use('/api/users', routes_users);
app.use('/api/markers', routes_markers);
// app.get('/api/tests', function (req, res) {
//   res.send('Hello World!')
// })

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

// Initialize DB
const DB_FILE = paths.db_file;
const TABLE_NAMES = ['users', 'markers'];
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) throw err;
    console.log(TABLE_NAMES);
    //Test if comments table exists - if not create it
    TABLE_NAMES.forEach((table_name) => {
        let result = db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`, [table_name], (err, row) => {
            if (!row) {
                let query = table_name === 'users'
                    ? `CREATE TABLE ${table_name} (id INTEGER PRIMARY KEY, name TEXT, email TEXT, username TEXT, password TEXT, role TEXT, image TEXT);`
                    : `CREATE TABLE ${table_name} (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, text TEXT, coordinates TEXT, date INTEGER, image TEXT, FOREIGN KEY(user_id) REFERENCES users(id));`;
                console.log(db);
                db.run(query, [], (err) => {
                    if (!err) {
                        console.log(`Table "${table_name}" successfully created in db: ${DB_FILE}`);
                        if (table_name === 'users')
                            db.run(`INSERT INTO users VALUES (1, 'Денис Ангелов', 'denis.angelov@gmail.com', 'admin', 'admin', 'ADMIN')`, [], (err) => {
                                if (!err)
                                    console.log(`Successfully inserted in table: users`);
                                else
                                    console.log(err);
                            });
                    }
                    else
                        console.log(err);
                });
            }
            // else {
            //     let query = `DROP TABLE ${table_name};`;
            //     db.run(query, [], (err) => {
            //         if (!err)
            //             console.log(`Table "${table_name}" successfully dropped in db: ${DB_FILE}`)
            //     });
            // }
        });
        console.log(result);
    });
    console.log(`Successfully connected to SQLite server`);

    //Add db as app local property
    app.locals.db = db;

    //Start the server
    app.listen(9000, (err) => {
        if (err) throw err;
        console.log('Example app listening on port 9000!')
    });
});