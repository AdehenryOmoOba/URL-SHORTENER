const dotenv = require('dotenv')
const express = require('express')
const server = express()
const mongoose = require('mongoose')
const urlModel = require('./models/urlModel')
const PORT = process.env.PORT || 5000

if(process.env.NODE_ENV !== 'production'){
    dotenv.config()
}

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})

server.use(express.urlencoded({extended: false}))
server.use(express.static('public'))
server.set('view engine', 'ejs')

server.get('/', async (req, res) => {
    const allURLs = await urlModel.find()
    res.render('index', {allURLs})
})
server.post('/shorturl', async (req, res) => {
    const newURL = await urlModel.create({fullURL: req.body.fullurl})
    console.log({newURL})
    res.status(200).redirect('/')
})
server.get('/:shorturl', async (req, res) => {
    const url = await urlModel.findOne({shortURL: req.params.shorturl})
    if(!url) res.sendStatus(404)
    url.clicks++
    url.save()
    res.redirect(url.fullURL)
})

server.listen(PORT, () =>{
    console.log('Server listening on port 5000...')
})
