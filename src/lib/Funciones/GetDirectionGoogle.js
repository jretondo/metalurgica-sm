const https = require('https')
const { googlemaps } = require("../../Global/ApisKey.json")

async function getCoordinates(latitud, longitud, resolve) {
    https.request({
        host: 'maps.googleapis.com',
        path: `/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${googlemaps}`,
        method: 'GET'
    }, response => {
        var data = "";
        var sdata = "";

        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            sdata = JSON.parse(data)
            resolve(sdata)
        });
    }).end();
}

const getCoordinates2 = (latitud, longitud) => {
    return new Promise(resolve => {
        (getCoordinates(latitud, longitud, resolve))
    })
}

module.exports = getCoordinates2