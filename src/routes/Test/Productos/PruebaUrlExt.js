const express = require('express')
const PruebaUrl = express()
const fs = require('fs');
const https = require('https');
const path = require('path')

PruebaUrl.post('/pruebaurl', (req, res) => {

    const ExtUrl = req.body.url
    const Carpeta = path.join(__dirname, "..", "..", "..", "..", "Public", "Imagenes", "imagenPr.jpg")

    saveImageToDisk(ExtUrl, Carpeta)
    res.send(Carpeta);
    function saveImageToDisk(url, localPath) {
        var fullUrl = url;
        var file = fs.createWriteStream(localPath);
        var request = https.get(url, function (response) {
            response.pipe(file);
        });
    }
})

module.exports = PruebaUrl