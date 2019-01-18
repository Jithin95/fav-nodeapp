const express = require('express');
const userRouter = express.Router();
const userData = require('../model/user_model');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var validationErrors = "";
userRouter.use(expressValidator())

userRouter.use(bodyParser.urlencoded({
    extended: false
}));
userRouter.use(bodyParser.json()); // Body parser use JSON data

userRouter.get('/createuser', (req, res) => {
    res.render('user_add', {
        validationErrors: '',
        currentusername: req.session.currentusername
    });
});


userRouter.post('/createuser', (req, res) => {
    validationErrors = ''
    var username = req.body.username;
    req.checkBody('username', 'Username is required').notEmpty();

    var validationErrors = req.validationErrors();
    if (validationErrors) {
        res.render('user_add', {
            validationErrors: validationErrors[0].msg
        });
    } else {
        userData.findOne({
            username: username
        }, (err, user) => {
            if (!user) { //register
                var item = {
                    username: username
                };
                var user = new userData(item);
                user.save((err, saveduser) => {
                    if (!err) {
                        req.session.currentuser = saveduser._id
                        req.session.currentusername = user.username
                        console.log("User Created " + username);
                        res.redirect('/')
                    } else {
                        res.status(500).send(err)
                    }
                    console.log(err, saveduser);
                });

            } else { // login
                req.session.currentuser = user._id
                req.session.currentusername = user.username
                res.redirect('/')
            }
        });
    }

});

userRouter.get('/addfavourite/:postid', (req, res) => {
    var post_id = req.params.postid
    var currentuser_id = req.session.currentuser
    if (currentuser_id) {
        userData.update(
            { _id: currentuser_id },
            { $addToSet: { fav_items: post_id } }, (err, resp)=> {
                console.log(resp);
                if (!err) {
                    res.redirect('/')
                } else {
                    res.status(500).send(err)
                }
            }
        )
    }
})

userRouter.get('/removefavourite/:postid', (req, res) => {
    var post_id = req.params.postid
    var currentuser_id = req.session.currentuser
    if (currentuser_id) {
        userData.update(
            { _id: currentuser_id },
            { $pull: { fav_items: post_id } }, (err, resp)=> {
                if (!err) {
                    res.redirect('/')
                } else {
                    res.status(500).send(err)
                }
            }
        )
    }
})



userRouter.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/createuser');
        }
    });
});



module.exports = userRouter;
