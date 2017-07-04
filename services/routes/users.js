const express = require('express');
const router = express.Router();
const error = require('../error').sendErrorResponse;
const util = require('util');
const indicative = require('indicative');


// GET users list (optionally by username)
router.get('/', function (req, res) {
    console.log('GET');
    const db = req.app.locals.db;
    let sqlQuery = 'SELECT * FROM users';
    const qParams = [];

    if (typeof req.query.username !== 'undefined') {
        sqlQuery += ' WHERE username = ?';
        qParams.push(req.query.username);
        db.get(sqlQuery, qParams, function (err, result) {
            if (typeof result !== 'undefined') {
                res.status(200).json(result);
            } else {
                error(req, res, 404, `User with username "${req.query.username}" not found.`, { message: `User with username "${req.query.username}" not found.` });
                // res.json({ message: `User with username "${req.query.username}" not found.` });
            }
        });
    } else {
        db.all(sqlQuery, qParams, function (err, results) {
            if (err) throw err;
            res.json(results);
        });
    }
});

// GET single user by id
router.get('/:userId', (req, res) => {

    const messages = {
    };
    const rules = {
        userId: 'required|integer|above:0'
    };

    const db = req.app.locals.db;
    const params = indicative.sanitize(req.params, { userId: 'to_int' });

    indicative.validate(params, rules)
        .then(() => {
            db.get('SELECT * FROM users WHERE id = ?', [params.userId], function (err, result) {
                if (err) throw err;
                if (result) {
                    res.status(200).json(result);
                } else {
                    // error(req, res, 404, `User with Id=${params.userId} not found.`);
                }
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
        });
});

// GET login
router.post('/login', (req, res) => {
    let body = req.body;

    const messages = {
        required: 'The field "{{field}}" is required to setup profile',
        'confirmPassword.equals': 'Wrong password!'
    };
    const rules = {
        id: 'required|integer|above:0',
        confirmPassword: 'equals:' + body.password
    };

    const db = req.app.locals.db;

    indicative.validate(body, rules, messages)
        .then(() => {
            db.get('SELECT * FROM users WHERE id = ? AND password = ?', [body.id, body.confirmPassword], function (err, result) {
                if (err) throw err;
                if (typeof result !== 'undefined') {
                    res.status(200).json(result);
                    // db.all('SELECT * FROM markers WHERE user_id = ?', [result.id], function (err, markers) {
                    //     // console.log(markers);
                    //     result = Object.assign({}, result, { markers });
                    //     // console.log(result);
                    //     res.status(200).json(result);
                    // });
                }
                else
                    error(req, res, 404, `Wrong password!`, { message: `Wrong password!` });
            });
        })
        .catch((errors) => {
            error(req, res, 404, 'Invalid user ID: ' + util.inspect(errors), errors[0])
        });
});

// Create new user
router.post('/', function (req, res) {
    let body = req.body;
    console.log(body);

    const messages = {
        required: 'The field "{{field}}" is required to edit profile',
        // 'name': 'Name is required to setup profile',
        'email': 'Invalid email',
        // 'username': 'Username is required to setup profile',
        // 'password': 'Password is required to setup profile',
        'confirmPassword.equals': 'Passwords must match'
    };
    const rules = {
        id: 'integer|above:0',
        name: 'required|string|min:2',
        email: 'email|required',
        username: 'required|string|min:2',
        password: 'required|string|min:2',
        confirmPassword: 'required|string|equals:' + body.password
    };

    const db = req.app.locals.db;
    indicative.validate(body, rules, messages)
        .then(() => {
            db.run(`INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?);`, [body.name, body.email, body.username, body.password, body.role], function (err) {
                if (err) {
                    console.error(err);
                    error(req, res, 500, `Error creating new user: ${body}`);
                }
                body.id = this.lastID;
                const uri = req.baseUrl + '/' + body.id;
                console.log('Created: ', uri);
                res.location("/").status(201).json(body);
            });
        })
        .catch((errors) => {
            error(req, res, 400, `Invalid user data: ${util.inspect(errors)}`, errors[0]);
        });
});

// Delete user by id
router.delete('/:userId', function (req, res) {
    const db = req.app.locals.db;
    const params = indicative.sanitize(req.params, { userId: 'to_int' });

    indicative.validate(params, { userId: 'required|integer|above:0' })
        .then(() => {
            db.run('DELETE FROM users WHERE id = ?', [params.userId], function (err) {
                if (err) {
                    console.error(err);
                    error(req, res, 500, `Error deleting user with Id: ${params.userId}`);
                }
                if (this.changes > 0) {
                    console.log('Deleted: ', req.baseUrl);
                    res.json({ message: `User ${params.userId} was deleted successfully.` });
                } else {
                    error(req, res, 404, `User with Id=${params.userId} not found.`, { message: `User with Id=${params.userId} not found.` });
                }
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors), errors[0]);
        });
});

// Edit user info
router.put('/:userId', function (req, res) {
    const db = req.app.locals.db;
    let user = req.body;
    console.log(user);
    const messages = {
        required: 'The field "{{field}}" is required to setup profile',
        // 'name': 'Name is required to setup profile',
        'email': 'Invalid email',
        // 'username': 'Username is required to setup profile',
        // 'password': 'Password is required to setup profile',
        'confirmPassword.equals': 'Passwords must match'
    };
    const rules = {
        id: 'integer|above:0',
        name: 'required|string|min:2',
        email: 'email|required',
        password: 'required|string|min:2',
        confirmPassword: 'required|string|equals:' + user.password
    };

    indicative.validate(user, rules, messages)
        .then(() => {
            db.run(`UPDATE users 
                    SET name = ?, email = ?, password = ?
                    WHERE id = ?;`, [user.name, user.email, user.password, user.id], function (err) {
                    if (err) {
                        console.error(err);
                        error(req, res, 500, `Error editing user: ${user}`, { message: `Error editing user: ${user}` });
                    }
                    user.id = this.lastID;
                    const uri = req.baseUrl + '/' + user.id;
                    console.log('Updated: ', uri);
                    res.status(200).json(user);
                });
        })
        .catch((errors) => {
            error(req, res, 400, `Invalid user data: ${util.inspect(errors)}`, errors[0]);
        });
});

module.exports = router;
