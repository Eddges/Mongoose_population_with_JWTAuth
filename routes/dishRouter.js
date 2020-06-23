const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Dishes = require('../models/dishes')

const dishRouter = express.Router();
dishRouter.use(bodyParser.json())

dishRouter.route('/')

.get((req, res, next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    }, (err) => {next(err)})
    .catch( err => {
        next(err)
    })
})

.post((req, res, next) => {
    Dishes.create(req.body)
    .then( dishes => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    }, err => {
        next(err)
    })
    .catch(err => {
        next(err)
    })
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes')
})

.delete((req, res, next) => {
    Dishes.remove({})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
    }, err => {
        next(err)
    })
    .catch( err => {
        next(err)
    })
})




dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    }, (err) => {next(err)})
    .catch( err => {
        next(err)
    })
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on  : /dishes/dishId')
})

.put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set : req.body
    }, { new : true})
    .then( dishes => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    }, err => {
        next(err)
    })
    .catch(err => {
        next(err)
    })
})

.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    }, (err) => {next(err)})
    .catch(err => {
        next(err)
    })
})

















dishRouter.route('/:dishId/comments')

.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(dish.comments)
        }
        else{
            const err = new Error('Dish ' + req.params.dishId + ' not found')
        }
    }, (err) => {next(err)})
    .catch( err => {
        next(err)
    })
})

.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(dish) {
            dish.comments.push(req.body)
            dish.save()
            .then(dish => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            })
        }
        else{
            const err = new Error('Dish ' + req.params.dishId + ' not found')
        }
    })
    .catch( err => {
        next(err)
    })
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes')
})

.delete((req, res, next) => {
    Dishes.findById(req.params.id)
    .then( dish => {
        if(dish) {
            for(let i = 0; i < dish.comments.length; i++) {
                dish.comments.id(dish.comments[i]._id).remove()
            }
            dish.save()
            .then(dish => {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.json(dish)
            })
        }
        else{
            const err = new Error('Dish ' + req.params.dishId + ' not found')
        }
    })
    .catch( err => {
        next(err)
    })
})




dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(dish && dish.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'appliction/json')
            res.json(dish.comments.id(req.params.commentId))
        }
        else if(!dish) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, err => { next(err) })
    .catch( err => {
        next(err)
    })
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on this URL')
})

.put((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then( dish => {
        if(dish && dish.comments.id(req.params.commentId)) {
            if(req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating
            }
            if(req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment
            }
            dish.save()
            .then(dish => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            })
        }
        else if(!dish) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, err => { next(err) })
    .catch( err => {
        next(err)
    })
})

.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish && dish.comments.id(req.params.commentId)){
            dish.comments.id(req.params.commentId).remove()
            dish.save()
            .then(dish => {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.json(dish)
            })
        }
        else if(!dish) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, err => { next(err) })
    .catch( err => {
        next(err)
    })
})





module.exports = dishRouter;