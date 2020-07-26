var express = require('express');
var userRouter = express.Router();
var bodyParser = require('body-parser')
var passport = require('passport')
var authenticate = require('../authenticate')

userRouter.use(bodyParser.json())
var User = require('../models/users')

userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
})


//The signup process will be the same, we will create a new user and 
//verify it using passport.authenticate
//But since we are not using sessions, hence no cookies/session is generated
userRouter.post('/signup', (req, res, next) => {
  User.register(new User({username : req.body.username}), req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.json({err : err})
    }

    else{
      if(req.body.firstname){
        user.firstname = req.body.firstname
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname
      }
      user.save()
      .then(() => {
          passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success : true ,status : 'Registration successful'})      })

      })
    }
  })
})


//In the login process, we first check if the details are correct
//If they are, we create a token with authenticate.getToken by passing
//the specific user details to it (the id in this case) and the function getToken
//will return a signed token with id parameter, secret key and expiration
userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
    console.log('local authentication successful')
    var token = authenticate.getToken({_id : req.user._id})
    console.log('token creation successful')
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({success : true, token : token, status : 'Login successful!'})
})



userRouter.get('/logout', (req, res, next) => {
  if(req.session){
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    var err = new Error('You are not logged in')
    err.status = 403
    next(err)
  }
})


module.exports = userRouter;