const express = require('express')
const authenticate = require('../authenticate')
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require('./cors')

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'public/images')
    },
    filename : (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const imageFileFilter = (req, file, callback) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Server can only handle image files. Proceed accordingly!'))
    }
    callback(null, true)
}

const upload = multer({ storage : storage, fileFilter: imageFileFilter})

const uploadRouter = express.Router()

uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 200
    res.end('GET operation not supported on /fileUpload')
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(req.file)
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 200
    res.end('PUT operation not supported on /fileUpload')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 200
    res.end('DELETE operation not supported on /fileUpload')
})


module.exports = uploadRouter