const express = require('express')
const bodyParser = require('body-parser')

const leaderRouter = express.Router()

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain')
    next()
})
.get((req, res, next) => {
    res.end('Sending the details of leaders');
})

.post((req, res, next) => {
    res.end('Adding the leader : ' + req.body.name + ' with details : ' + req.body.description)
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders ')
})

.delete((req, res, next) => {
    res.end('Deleting the entries from /leaders')
})



leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    res.end('Getting the leader with ID : ' + req.params.leaderId);
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on  : /leaders/' + req.params.leaderId)
})

.put((req, res, next) => {
    res.write('Updating the leader: ' + req.params.leaderId)
    res.end('\nUpdating the leader: ' + req.body.name + ' with details : ' + req.body.description)
})

.delete((req, res, next) => {
    res.end('Deleting the leader : ' + req.params.leaderId)
})


module.exports = leaderRouter