const express = require('express')
const EliminarHero = express()
const path = require('path');
const Consultador = require("../../../../database/Consultador")
const fs = require("fs")

EliminarHero.post("/test/delete-hero-id", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const idHero = request.id
    const sql1 = `DELETE FROM tb_hero_slider WHERE id = ?`

    let result1
    let respuesta

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [idHero]
        })
    } finally {
        const rowsAff = parseInt(result1.affectedRows)

        if (rowsAff > 0) {
            const imageName = idHero.id + ".jpg"
            const directory = path.join(__dirname, '..', '..', '..', '..', 'Public', 'Imagenes', 'HeroSlider', imageName)
            fs.rmdir(directory, { recursive: true })

            respuesta = {
                status: 200,
                result: result1
            }
            res.send(respuesta)
        } else {
            respuesta = {
                status: 500,
                error: "No se encontró el email colocado!"
            }
            res.send(respuesta)
        }
    }

})

module.exports = EliminarHero