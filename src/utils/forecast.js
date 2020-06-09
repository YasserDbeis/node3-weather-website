const request = require('request')


const forecast = (longitude, latitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=f8e726ad31a594ae27252421df3f3844&query=' + latitude + ',' + longitude + '&units=f'
    request({url, json: true}, (error, {body}) => {
        if(error) {
            callback('Could not connect to forecast service!', undefined)
        }
        else if(body.error) {
            callback('Could not find forecast for specified location!')
        }
        else {
            callback(undefined, body.current.weather_descriptions[0] + ". It is currently " + body.current.temperature + " degrees out. Yet, it feels like " + body.current.feelslike + " as of " + body.current.observation_time)
        }
    })
}


module.exports = forecast