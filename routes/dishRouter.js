const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Dishes = require('../models/dishes')
var authenticate = require('../authenticate')
const cors = require('./cors')

const dishRouter = express.Router();
dishRouter.use(bodyParser.json())

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
.get(cors.corsWithOptions, (req, res, next) => {
    
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    }, (err) => {next(err)})
    .catch( err => {
        next(err)
    })
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

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

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes')
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

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
.options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })

.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes)
    }, (err) => {next(err)})
    .catch( err => {
        next(err)
    })
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on  : /dishes/dishId')
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })

.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
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

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(dish) {
            req.body.author = req.user._id
            dish.comments.push(req.body)
            dish.save()
            .then(dish => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then(dish => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish)
                })
                
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

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /dishes')
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
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
.options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })

.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
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

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on this URL')
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (
              req.user._id.equals(dish.comments.id(req.params.commentId).author)
            ) {
              if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
              }
              if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment =
                  req.body.comment;
              }
              dish.save().then(
                (dish) => {
                  Dishes.findById(dish._id)
                    .populate("comments.author")
                    .then((dish) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(dish);
                    });
                },
                (err) => next(err)
              );
            } else {
              err = new Error("You are not authorized to update this comment");
              err.status = 403;
              return next(err);
            }
          } else if (dish == null) {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })


.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
Dishes.findById(req.params.dishId)
    .then(
    (dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
        if (
            req.user._id.equals(dish.comments.id(req.params.commentId).author)
        ) {
            dish.comments.id(req.params.commentId).remove();
            dish.save().then(
            (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            },
            (err) => next(err)
            );
        } else {
            err = new Error("You are not authorized to delete this comment");
            err.status = 403;
            return next(err);
        }
        } else if (dish == null) {
        err = new Error("Dish " + req.params.dishId + " not found");
        err.status = 404;
        return next(err);
        } else {
        err = new Error("Comment " + req.params.commentId + " not found");
        err.status = 404;
        return next(err);
        }
    },
    (err) => next(err)
    )
    .catch((err) => next(err));
});





module.exports = dishRouter;