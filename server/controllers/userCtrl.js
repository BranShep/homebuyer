// import app from '../index.js';
import app from '../index.js';
const db = app.get('db');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const config = require('../config.js')




class User {
    constructor(user_id, name, email, token, auth_user_type_id) {
        this.user_id = user_id;
        this.name = name;
        this.email = email;
        this.token = token;
        this.auth_user_type_id = auth_user_type_id;
    }
}





module.exports = {
    readUserById: (req, res, next) => {
        db.read_user_by_email(req.params.email, (error, response) => {
            if(error){
                res.json({
                    status: 500,
                    message: error,
                    method: 'readUserById'
                })
            }
            else if (response){
                res.json(response)
            }
        })

    },

    googleLogin: (req, res, next) => {
        console.log('You\'re in googleLogin', req.body)
        //#1 check to see if the user is already in the database
        db.read_email_google([req.body.email], (error, response) => {
            if (error) {
                res.json({
                    status: 500,
                    message: error,
                    method: 'googleLogin, read_email_google'
                })
            }
            //#1 if they are we will send back the user object with the associated token
            else if (response.length > 0){
                console.log(response);


                let currentUser = new User(response[0].id, response[0].name, response[0].email, response[0].token, 2);

                res.json(currentUser);
            }
            //#2 if not we will create the user and token and then send back the same info
            else if (response.length === 0){
                let newUser = {name: req.body.name, email: req.body.email, random: Math.random()};
                let token = jwt.encode(newUser, config.secret);
                db.add_user_google([req.body.name, req.body.email, req.body.third_party_id, token], (error, response) => {
                    if (error) {
                        res.json({
                            status: 500,
                            message: error,
                            method: 'googleLogin, add_user_google'
                        })
                    }
                    else if (response){
                        db.read_email_google(req.body.email,(error, response)=>{
                            if (error) {
                                res.json({
                                    status: 500,
                                    message: error,
                                    method: 'googleLogin, read_email_google'
                                })
                            }
                            else if (response){
                            //   console.log(response);
                              let currentUser = new User(response[0].id, response[0].name, response[0].email, response[0].token, 2)
                              res.json(currentUser);
                            }
                        })
                    }
                })
            }
        })
    },
    localLogin: (req, res, next) => {
        console.log('You\'re in localLogin and this is the request body', req.body)
        //Check to see if email exists as local user in the database
        db.read_user_local(req.body.email, (error, response) => {
            if (error) {
                res.json({
                    status: 500,
                    message: error,
                    method: 'localLogin, read_user_local'
                })
            }
            //if it does exist check to see if they passed in the correct password
            else if (response.length > 0) {
                console.log(response);
                //we can now check to passed in password vs what was returned in read_user_local
                bcrypt.compare(req.body.password, response[0].password, (err, BCresponse) => {
                    console.log(BCresponse)
                    if (err) {
                     res.json({
                         status: 500,
                         message: error,
                         method: 'localLogin, read_user_local_email_password, bcrypt.compare'
                     })
                 }
                else if (BCresponse === true){
                    console.log('you did it right')
                     let currentUser = new User(response[0].id, response[0].name, response[0].email, response[0].token, 1);
                     res.json(currentUser);
                 }
                 else if (BCresponse === false) {
                     res.json({
                         status: 200,
                         message: 'The password entered did not match the email provided.',
                         method: 'localLogin, read_user_local_email_password'
                     })
                 }
                })
            }
            //if email isn't found respond with that info
            else if (response.length === 0) {
                res.json({
                    status: 200,
                    message: 'localAuth account using this email was not found in the database',
                    method: 'localLogin, read_user_local'
                })
            }


        })

    },
    localRegister: (req, res, next) => {
        //#1Check to see if email already exists in the users table
          console.log(req.body);
            db.read_user_local(req.body.email, (error, response) => {
                if (error) {
                        res.json({
                            status: 500,
                            message: error,
                            method: 'localRegister'
                        })
                    }
                //#1 if it exists send back an error message saying the email is being used and they need to use another email
                else if (response.length > 0) {
                    res.json({
                            status: 200,
                            message: 'User already exists in the database. Please login.',
                            method: 'localRegister'
                        })
                }
                //#2 if it doesn't exist add the email to the users table and create a token send back the new user object.
                else if (response.length === 0) {
                    console.log("user does not exist")
                    let newUser = { name: req.body.name, email: req.body.email, random: Math.random() };
                    let token = jwt.encode(newUser, config.secret)
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) console.log(err);
                        db.add_user_local([req.body.name, req.body.email, hash, token], (error, response) => {
                            if (error) {
                                console.log(error);
                                res.json({
                                    status: 500,
                                    message: error,
                                    method: 'localRegister'
                                })
                            }
                            else if (response) {
                                let currentUser = new User(response[0].id, req.body.name, req.body.email, token, 1);
                                res.json(currentUser);
                            }
                        })
                    })
                }
            })
    },
authenticateRequest: (req, res, next) => {
    //check to see if token has been tampered with
    try {
        let decoded = jwt.decode(req.query.token, config.secret)
    }
    catch (e){
        if (e instanceof SyntaxError){
             res.json({
                status: 200,
                message: 'User is not authenticated, redirect.',
                method: 'authenticateRequest, read_user_id_token',
                redirect: true,
            })
        }
    }
    //check to see if the user_id and token are a match
    db.read_user_id_token([Number(req.query.user_id), req.query.token], (error, response) => {
        console.log(req.query)
        if (error) {
            console.log(error);
            res.json({
                status: 500,
                message: error,
                method: 'authenticateRequest, read_user_id_token'
            })
        }
        else if (response.length > 0){
            //if they are call next()
            next();
        }
        else if (response.length === 0) {
             //if they don't match send back a reponse saying to gtfo
            res.json({
                status: 200,
                message: 'User is not authenticated, redirect.',
                method: 'authenticateRequest, read_user_id_token',
                redirect: true
            })
        }
    })
}

}
