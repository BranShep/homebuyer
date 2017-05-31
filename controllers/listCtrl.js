'use strict';

var app = require('../index.js');
var db = app.get('db');
module.exports = {

    createList: function createList(req, res, next) {
        console.log('You are in createList', req.body);
        db.create_list([req.body.user_id, req.body.list_name], function (CLerror, CLresponse) {
            if (CLerror) {
                res.json({
                    status: 500,
                    message: CLerror,
                    method: 'createList'
                });
            } else if (CLresponse) {
                for (var i = 0; i < req.body.priorities.length; i++) {
                    db.create_priorities([Number(CLresponse[0].id), Number(req.body.user_id), req.body.priorities[i].priority_description, Number(req.body.priorities[i].priority_value)], function (CPerror, CPresponse) {
                        if (CPerror) {
                            res.json({
                                status: 500,
                                message: CPerror,
                                method: 'createList, create_priorities'
                            });
                        }
                    });
                }
                res.json({
                    message: "Priorities added successfully",
                    status: 200,
                    method: 'CreateList, create_priorities',
                    list_name: CLresponse[0].name,
                    list_id: CLresponse[0].id
                });
            }
        });
    },
    deactivateList: function deactivateList(req, res, next) {
        db.deactivate_list(req.params.id, function (error, response) {
            if (error) {
                res.json({
                    status: 500,
                    message: error,
                    method: 'deactivateList, deactivate_list'
                });
            } else if (response) {
                res.json({
                    status: 200,
                    message: "List deactivated successfully",
                    method: 'deactivateList, deactivate_list'
                });
            }
        });
    },

    readListByUserId: function readListByUserId(req, res, next) {
        console.log('you are in readListByUserId', req.params);
        db.read_list_by_user_id(req.params.user_id, function (error, response) {
            if (error) {
                res.json({
                    status: 500,
                    message: error,
                    method: 'readListByUserId'
                });
            } else {
                console.log('This is the response from readHomesByUserId', response);
                res.json(response);
            }
        });
    },
    readHomesByListId: function readHomesByListId(req, res, next) {
        console.log('Your in readHomesByListId', req.params);
        db.read_homes_by_list_id(Number(req.params.list_id), function (error, response) {
            if (error) {
                res.json({
                    status: 500,
                    message: error,
                    method: 'readHomesByListId'
                });
            } else if (response) {
                console.log('This is the response: ', response);
                res.json(response);
            }
        });
    }
};