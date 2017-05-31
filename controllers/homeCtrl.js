'use strict';

var app = require('../index.js');
var db = app.get('db');

function Rating(rating_description, rating_value, priority_id) {
    this.rating_description = rating_description;
    this.rating_value = rating_value;
    this.priority_id = priority_id;
}

module.exports = {

    createHome: function createHome(req, res, next) {
        console.log(req.body);
        //create a home with db.create_home
        db.create_home([req.body.list_id, req.body.nickname, req.body.price, req.body.address_1, req.body.address_2, req.body.city, req.body.zip, req.body.province, req.body.bathrooms, req.body.bedrooms, req.body.sq_feet, req.body.year_build, req.body.description, req.body.days_listed], function (CHerror, CHresponse) {
            // console.log('CHresponse[0].id', CHresponse[0].id)

            if (CHerror) {
                console.log('CHerror', CHerror);
                res.json({
                    status: 500,
                    message: CHerror,
                    method: 'createHome'
                });
            } else if (CHresponse) {
                console.log('CHresponse', CHresponse);
                db.read_priorities([req.body.list_id, req.body.user_id], function (RPerror, RPresponse) {

                    if (RPerror) {
                        console.log('RPerror', RPerror);
                        res.json({
                            status: 500,
                            message: RPerror,
                            method: 'createHome, read_priorities'
                        });
                    } else if (RPresponse) {
                        console.log('RPresponse', RPresponse);
                        var ratings = [];
                        for (var i = 0; i < RPresponse.length; i++) {
                            var singleRating = new Rating(RPresponse[i].priority_description, 50, RPresponse[i].id);
                            ratings.push(singleRating);
                        }
                        // console.log('ratings', ratings)
                        console.log('ratings', ratings);
                        for (var i = 0; i < ratings.length; i++) {
                            console.log(CHresponse[0].id, req.body.user_id, ratings[i].priority_id, ratings[i].rating_description, ratings[i].rating_value);

                            db.create_ratings([Number(CHresponse[0].id), Number(req.body.user_id), Number(ratings[i].priority_id), ratings[i].rating_description, Number(ratings[i].rating_value)], function (CRerror, CRresponse) {

                                if (CRerror) {
                                    console.log('CRerror', CRerror);
                                    res.json({
                                        status: 500,
                                        message: CRerror,
                                        method: 'createRatings, create_ratings'
                                    });
                                }
                            });
                        }
                        res.json({
                            status: 200,
                            message: 'Home created successfully test!',
                            method: 'createHome, create_ratings',
                            home_id: Number(CHresponse[0].id)
                        });
                    }
                });
            }
            //get priorities using the list_id and user_id from the
            //insert rows into ratings using the returned list of priorities
        });
    },
    readHomesByHomeId: function readHomesByHomeId(req, res, next) {
        console.log('You\'re in readHomesByHomeId: ', req.params);
        db.read_homes_by_home_id(req.params.home_id, function (RHerror, RHresponse) {
            if (RHerror) {
                res.json({
                    status: 500,
                    message: RHerror,
                    method: 'createHome'
                });
            } else if (RHresponse) {
                db.get_homescore_by_home_id(req.params.home_id, function (GHerror, GHresponse) {
                    if (GHerror) {
                        res.json({
                            status: 500,
                            message: error,
                            method: 'createHome'
                        });
                    } else if (GHresponse) {
                        var newResponse = RHresponse[0];
                        newResponse.home_score = GHresponse[0].home_score;
                        console.log('newResponse :', newResponse);
                        res.json(newResponse);
                    }
                });
            }
        });
    },
    deactivateHome: function deactivateHome(req, res, next) {
        db.deactivate_home(req.params.home_id, function (error, response) {
            if (error) {
                res.json({
                    status: 500,
                    message: error,
                    method: 'deactivateHome, deactivateHome'
                });
            } else if (response) {
                res.json({
                    status: 200,
                    message: 'Home deactivated successfully!',
                    method: 'deactivateHome, deactivate_home'
                });
            }
        });
    },
    editHome: function editHome(req, res, next) {
        console.log('you are in editHome', req.body);
        db.update_home([req.body.nickname, req.body.price, req.body.address_1, req.body.address_2, req.body.city, req.body.zip, req.body.province, req.body.bathrooms, req.body.bedrooms, req.body.sq_feet, req.body.year_build, req.body.description, req.body.days_listed, req.body.id], function (error, response) {

            if (error) {
                console.log('error :', error);
                res.json({
                    status: 500,
                    message: error,
                    method: 'editHome'
                });
            } else {
                console.log('response', response);
                res.json(response[0]);
            }
        });
    }
};