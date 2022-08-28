const express = require('express')
const Optimizador = express()
const tinify = require("tinify");
tinify.key = "bbb5LGP5xPyXgrhYyS8BzB8NFfkLchtv";
const path = require('path');

Optimizador.post('/test/optimizador-img-hero', async (req, res) => {
    const request = req.body
    const idImg = request.idImg

    const directory = path.join(__dirname, '..', '..', '..', '..', 'Public', 'Imagenes', 'HeroSlider', idImg + ".jpg")

    const source = tinify.fromFile(directory);
    const resized = await source.resize({
        method: "cover",
        width: 1920,
        height: 775
    });
    resized.toFile(directory);

    res.send("algo");
});

module.exports = Optimizador;