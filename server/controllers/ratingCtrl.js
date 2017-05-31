const app = require('../index.js');
const db = app.get('db');
module.exports = {
    createRatings: (req, res, next) => {
        console.log(req.body)
        for (var i = 0; i < req.body.ratings.length; i++) {
            db.create_ratings([Number(req.body.home_id), Number(req.body.user_id), Number(req.body.ratings[i].priority_id), req.body.ratings[i].rating_description, Number(req.body.ratings[i].rating_value)], (error, response) => {
                    if (error) {
                        console.log(error)
                        res.json({
                            status: 500,
                            message: error,
                            method: 'createRatings, create_ratings'
                        })
                    }                
            })
        }
        res.json({
            status: 200,
            message: "Ratings added successfully",
            method: 'createRatings, create_ratings'
        })
    },
    readRatings: (req, res, next) => {
        // console.log('req.query:', req.query);
        db.read_ratings([req.query.user_id, req.query.home_id], (error, response) => {
            if (error) {
                    if (error) {
                        res.json({
                            status: 500,
                            message: error,
                            method: 'readRatings, read_ratings'
                        })
                    }
                }
            else if (response) {
                res.json(response);
            }
        })
    },
    editRatings: (req, res, next) => {
        console.log('editRatings req.body', req.body);
        for (var i = 0; i < req.body.ratings.length; i++) {
            db.update_ratings([req.body.ratings[i].rating_description, req.body.ratings[i].rating_value, req.body.ratings[i].id], (error, response) => {
                if (error) {
                    res.json({
                        status: 500,
                        message: error,
                        method: 'editRatings, edit_ratings'
                    })
                }
            })
        }
        res.json({
            message: "Ratings updated successfully",
            status: 200,
            method: 'editRatings, edit_ratings'
        })
    }
}
