const app = require('../index.js');
const db = app.get('db');
module.exports = {

createPriorities: (req, res, next)=>{
    // console.log(req.body.length);
    // console.log(req.body.priorities);
    console.log('createPriorities', req.body);
    
    
    for (var i = 0; i < req.body.priorities.length; i++){
    db.create_priorities([Number(req.body.list_id), Number(req.body.user_id), req.body.priorities[i].priority_description, Number(req.body.priorities[i].priority_value)], (error, response) => {
        if (error) {
                // res.json({
                //     status: 500,
                //     message: error,
                //     method: 'createPriorities, create_priorities'
                // })
               console.log('you bitch') 
            }

    })
    }
    console.log('You are past the loop')
    res.json({
        message: "Priorities added successfully",
        status: 200,
        method: 'createPriorities, create_priorities'
    })
},
readPriorities: (req, res, next) => {
    console.log(req.query);
    db.read_priorities([Number(req.query.list_id),Number(req.query.user_id)],(error, response) => {
        if (error) {
                console.log(error);
                res.json({
                    status: 500,
                    message: error,
                    method: 'readPriorities, read_priorities'
                })
            }
        else if (response) {
            res.json(response);
        }
    })
},
editPriorities: (req, res, next) => {
    console.log(req.body);
    for (var i = 0; i < req.body.priorities.length; i++) {
        db.update_priorities([req.body.priorities[i].priority_description, req.body.priorities[i].priority_value, req.body.priorities[i].id], (error, response) => {
            if (error) {
                res.json({
                    status: 500,
                    message: error,
                    method: 'editPriorities, update_priorities'
                })
            }
        })
    }
    res.json({
                message: "Priorities updated successfully",
                status: 200,
                method: 'editPriorities, update_priorities'
            })
},
deletePriority: (req, res, next) => {
    console.log(req.params)
    db.delete_priority(req.params.id, (error, response) => {
        if (error) {
                res.json({
                    status: 500,
                    message: error,
                    method: 'deletePriority, delete_priority'
                })
            }
        else if (response) {
            res.json({
                message: "Priorities updated successfully",
                status: 200,
                method: 'deletePriority, delete_priority'
            })
        }
    })
}
}
