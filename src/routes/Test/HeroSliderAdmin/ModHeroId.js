const express = require('express')
const ModHeroId = express()
const Consultador = require("../../../../database/Consultador")

ModHeroId.post("/test/mod-hero-id", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const idHero = request.id
    const title = request.title
    const subtitle = request.subtitle
    const tag = request.tag
    const tipo = parseInt(request.tipo)
    const color = request.color
    console.log(`color`, color)
    let link
    if (tipo === 0) {
        link = "/shop-grid-standard-tag/" + tag
    } else if (tipo === 1) {
        link = "/shop-grid-standard-sort/" + tag
    } else {
        link = "/shop-grid-standard-sort/"
    }
    const sql1 = `UPDATE tb_hero_slider SET title = ?, subtitle = ?, link = ?, tag = ?, type = ?, color = ? WHERE id = ?`
    let result1
    let respuesta

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [title, subtitle, link, tag, tipo, color, idHero]
        })
    } finally {
        const rowsAff = parseInt(result1.affectedRows)

        if (rowsAff > 0) {
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

module.exports = ModHeroId