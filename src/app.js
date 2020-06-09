const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')
const cors = require('cors')
const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
// app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  }); 

app.get('', (req, res) => {
    res.set('page-size', 20)
    res.set('Access-Control-Expose-Headers', 'page-size')
    res.render('index', {
        title: 'Weather App',
        name: 'Yasser Dbeis',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Yasser Dbeis',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'hey this is a message',
        title: 'Help',
        name: 'Yasser Dbeis'
    })
})

app.get('/weather', (req, res) => {

    if(!req.query.address) {
        return res.send({
            error: "You must provide an address!"
        })
    }

    geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {

        if(error) {
            return res.send({error})
        }

        forecast(longitude, latitude, (error, forecast) => {
            if(error) {
                return res.send({error})
            }

            res.send({
                forecast,
                location,
                address: req.query.address,
            })
        })

    })

})

app.get('/products', (req, res) => {

    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term!'
        })
    }

    console.log(req.query.search)
    res.send({
        products: [],
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: "404",
        error: 'Help page not found.',
        name: "Yasser Dbeis"
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: "404",
        error: '404 Page Not Found',
        name: "Yasser Dbeis"
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})

