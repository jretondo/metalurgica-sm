const express = require('express')
const Optimizador = express()
const tinify = require("tinify");
tinify.key = process.env.TINIFY_KEY;
const path = require('path');

Optimizador.post('/test/optimizador-img-prod', async (req, res) => {
    const request = req.body
    const idImg = request.idImg
    const directory = path.join(__dirname, '..', '..', '..', '..', 'Public', 'Imagenes', 'Productos', idImg.id + ".jpg")

    const source = tinify.fromFile(directory);
    const resized = await source.resize({
        method: "cover",
        width: 600,
        height: 600
    });
    await resized.toFile(directory);

    res.send("algo");
});

module.exports = Optimizador;