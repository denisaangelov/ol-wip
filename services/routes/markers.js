const express = require('express');
const router = express.Router();
const error = require('../error').sendErrorResponse;
const util = require('util');
const indicative = require('indicative');


// GET markers list (optionally by author)
router.get('/', function (req, res) {
    const db = req.app.locals.db;
    let sqlQuery = 'SELECT * FROM markers';
    const qParams = [];
    let userId = req.query.userId;
    if (userId > 0) {
        sqlQuery += ' WHERE user_id = ?';
        qParams.push(userId);
    }

    db.all(sqlQuery, qParams, function (err, results) {
        if (err) throw err;
        results.map((result) => {
            db.get('SELECT * FROM users WHERE user_id = ?', [result.user_id], function (err, user) {
                return Object.assign({}, result, { user });
            });
        });
        res.json(results);
    });
});

// GET single marker by id
router.get('/:markerId', (req, res) => {
    const db = req.app.locals.db;
    const params = indicative.sanitize(req.params, { markerId: 'to_int' });

    indicative.validate(params, { markerId: 'required|integer|above:0' })
        .then(() => {
            db.get('SELECT * FROM markers WHERE id = ?', [params.markerId], function (err, result) {
                if (err) throw err;
                if (typeof result !== 'undefined') {
                    res.json(result);
                }
                else {
                    error(req, res, 404, { errors: [`Marker with Id=${params.markerId} not found.`] });
                }
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid marker ID: ' + util.inspect(errors))
        });
});

// Create new marker
router.post('/', function (req, res) {
    const db = req.app.locals.db;
    let marker = req.body;

    // req.setRequestHeader('Content-Type', 'application/json');
    // req.setRequestHeader('Content-Length', Buffer.byteLength(marker));

    const messages = {
        required: 'The field "{{field}}" is required to setup marker!'
    };
    const rules = {
        id: 'integer|above:0',
        user_id: 'integer|above:0',
        title: 'required|string|min:2',
        text: 'required|string|min:2',
        coordinates: 'required|string'
    };
    indicative.validate(req.body, rules, messages).then(() => {
        db.run(`INSERT INTO markers (user_id, title, text, coordinates, date, image) VALUES (?, ?, ?, ?, ? ,?);`, [marker.user_id, marker.title, marker.text, marker.coordinates, marker.date, marker.image], function (err) {
            if (err) {
                console.error(err);
                error(req, res, 500, `Error creating new marker: ${marker}`, { message: `Error creating new marker: ${marker}` });
            }
            marker.id = this.lastID;
            const uri = req.baseUrl + '/' + marker.id;
            console.log('Created: ', uri);
            res.location(uri).status(201).json(marker);
        });
    }).catch((errors) => {
        error(req, res, 400, `Invalid marker data: ${util.inspect(errors)}`, errors[0]);
    });
});

// Delete marker by id
router.delete('/:markerId', function (req, res) {
    const db = req.app.locals.db;
    const params = indicative.sanitize(req.params, { markerId: 'to_int' });

    indicative.validate(params, { markerId: 'required|integer|above:0' })
        .then(() => {
            db.run('DELETE FROM markers WHERE id = ?', [params.markerId], function (err) {
                if (err) {
                    console.error(err);
                    error(req, res, 500, `Error deleting marker with Id: ${params.markerId}`);
                }
                if (this.changes > 0) {
                    console.log('Deleted: ', req.baseUrl);
                    res.json({ message: `Marker ${params.markerId} was deleted successfully.` });
                } else {
                    error(req, res, `Marker with Id=${params.markerId} not found.`);
                }
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid marker ID: ' + util.inspect(errors))
        });
});

// Create new marker
router.put('/:markerId', function (req, res) {
    const db = req.app.locals.db;
    let marker = req.body;

    const messages = {
        required: 'The field "{{field}}" is required to setup marker!'
    };
    const rules = {
        id: 'integer|above:0',
        user_id: 'integer|above:0',
        title: 'required|string|min:2',
        text: 'required|string|min:2',
        coordinates: 'required|string'
    };

    indicative.validate(req.body, rules, messages).then(() => {
        db.run(`UPDATE markers 
                SET user_id = ?, title = ?, text = ?, coordinates = ?, date = ?, image = ?
                WHERE id = ?;`, [marker.user_id, marker.title, marker.text, marker.coordinates, marker.date, marker.image, marker.id], function (err) {
                if (err) {
                    console.error(err);
                    error(req, res, 500, `Error udateing marker: ${marker}`, { message: `Error updateing marker: ${marker}` });
                }
                marker.id = this.lastID;
                const uri = req.baseUrl + '/' + marker.id;
                console.log('Updated: ', uri);
                res.status(200).json(marker);
            });
    }).catch((errors) => {
        error(req, res, 400, `Invalid marker data: ${util.inspect(errors)}`, errors[0]);
    });
});

module.exports = router;