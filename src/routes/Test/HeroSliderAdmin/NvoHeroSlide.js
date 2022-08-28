const express = require('express')
const NvoHeroId = express()
const Consultador = require("../../../../database/Consultador")
const pathimagenes = require("../../Test/Global/UrlImg")

NvoHeroId.post("/test/nvo-hero", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const title = request.title
    const subtitle = request.subtitle
    const tag = request.tag
    const tipo = parseInt(request.tipo)
    const color = request.color

    let link
    if (tipo === 0) {
        link = "/shop-grid-standard-tag/" + tag
    } else if (tipo === 1) {
        link = "/shop-grid-standard-sort/" + tag
    } else {
        link = "/shop-grid-standard-sort/"
    }

    const sql1 = `INSERT INTO tb_hero_slider (title, subtitle, image, link, enabled, tag, type, color) VALUES (?, ?, '', ?, 1, ?, ?, ?)`
    let result1
    let result2
    let respuesta

    let entorno = await pathimagenes("HeroSlider/")

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [title, subtitle, link, tag, tipo, color]
        })
    } finally {

        const rowsAff = parseInt(result1.affectedRows)

        if (rowsAff > 0) {

            const insertId = result1.insertId
            const NvaImg = `${entorno}${insertId}.jpg`
            const sql2 = `UPDATE tb_hero_slider SET image = ? WHERE id = ?`

            try {
                result2 = await query({
                    sql: sql2,
                    timeout: 2000,
                    values: [NvaImg, insertId]
                })
            } finally {
                const rowsAff2 = parseInt(result2.affectedRows)

                if (rowsAff2 > 0) {
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
        } else {
            respuesta = {
                status: 500,
                error: "No se encontró el email colocado!"
            }
            res.send(respuesta)
        }
    }

})

module.exports = NvoHeroId