const express = require('express');
const itemRouter = express.Router();
const itemData = require('../model/item_model');
const userData = require('../model/user_model');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var validationErrors = "";
itemRouter.use(expressValidator())
itemRouter.use(bodyParser.urlencoded({
    extended: false
}));
itemRouter.use(bodyParser.json()); // Body parser use JSON data

itemRouter.get('/', (req, res) => {
    if (req.session.currentuser) {
        userData.find({_id: req.session.currentuser}, {'_id' : 0,'fav_items' : 1}, (err, resp)=> {
            if (!err) {
                favourites = resp[0].fav_items
                itemData.updateMany({}, {$set: {isfav:false}}, (err, post) => {
                    if (!err) {
                        if (favourites && favourites.length > 0) {
                            itemData.updateMany({_id: {$in: favourites}}, {isfav: true}, (err, post) => {
                                itemData.updateMany({_id: {$nin: favourites}}, {isfav: false}, (err, post) => {
                                    itemData.find({}, (err, post)=> {
                                        console.log("Post items", post);
                                        res.render('index', {pageview: req.session.currentuser, currentusername: req.session.currentusername, postitems: post});
                                    })
                                })
                            });
                        } else {
                                itemData.find({}, (err, post)=> {
                                    res.render('index', {pageview: req.session.currentuser, currentusername: req.session.currentusername, postitems: post});
                                })
                        }
                    }
                })

            }

        })

    } else {
        res.redirect('/createuser');
    }
});



itemRouter.get('/add', (req, res) => {
    if (req.session.currentuser) {
        res.render('item_add', {
            validationErrors: '',
            currentusername: req.session.currentusername
        })
    } else {
        res.redirect('/createuser');
    }
});


itemRouter.post('/add', (req, res) => {
    if (req.session.currentuser) {
        validationErrors = ''
        var itemname = req.body.itemname;
        req.checkBody('itemname', 'Itemname is required').notEmpty();

        var validationErrors = req.validationErrors();
        if (validationErrors) {
            res.render('item_add', {
                validationErrors: validationErrors[0].msg
            });
        } else {
            var item = {
                itemname : itemname,
                isfav : false,
            };
            var itemModel = new itemData(item);
            itemModel.save((err, saveduser) => {
                console.log(err, saveduser)
                res.redirect('/')
            });
        }
    } else {
        res.redirect('/createuser');
    }
});

module.exports = itemRouter;
