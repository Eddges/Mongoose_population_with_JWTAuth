const express = require('express')
const bodyParser = require('body-parser')
const Favorites = require('../models/favorite')
const authenticate = require('../authenticate')

const favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user : req.user._id})
    // .populate('user')
    .populate('user dishes')
    .then((user) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(user)
    })
})

.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
    .then(user => {
        if(user) {
            req.body.map(iterator => {
                if(user.dishes.indexOf(iterator._id) === -1){
                    user.dishes.push(iterator._id)
                }

            })
            user.save()
            .then(doc => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(doc)
            })
        }

        else {
            Favorites.create({user : req.user._id})
            .then(newuser => {
                req.body.map(iterator => {      
                    newuser.dishes.push(iterator._id)
                })
                newuser.save()
                .then(doc => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(doc)
                })
            })
        }
    })

})

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorites')
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
    .then(user => {
        user.dishes = user.dishes.filter(iterator => 
            false )
        user.save()
        .then(doc => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(doc)
        })
    })
})



favoriteRouter.route('/:dishId')
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
    .then(user => {
        if(!user){
            Favorites.create({user : req.user._id})
            .then(user => {
                user.dishes.push(req.params.dishId)
                user.save()
                .then(doc => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(doc)
                })
            })
        }
        else{
            if(user.dishes.indexOf(req.params.dishId) === -1){
                user.dishes.push(req.params.dishId)
            }
            user.save()
            .then(doc => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(doc)
            })
        }

    })
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
    .then(user => {
        user.dishes = user.dishes.filter(iterator =>{
            return iterator._id!=req.params.dishId
        })
        user.save()
        .then(doc => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(doc)
        })
    })
})

module.exports = favoriteRouter