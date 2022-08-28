const express = require('express')
const DetallesOfer = express()
const Consultador = require("../../../../database/Consultador")

DetallesOfer.get("/test/get-det-hero/:id", async (req, res) => {
    const query = Consultador()
    const idSlider = req.params.id
    const sql1 = `SELECT * FROM tb_hero_slider WHERE id = ?`

    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [idSlider]
        })
    } finally {
        let heroData = []
        result1.map(heroSlide => {
            const id = heroSlide.id
            const title = heroSlide.title
            const subtitle = heroSlide.subtitle
            const image = heroSlide.image
            const url = heroSlide.link
            const enabled = heroSlide.enabled
            const tag = heroSlide.tag
            const tipo = heroSlide.type
            const color = heroSlide.color

            console.log(`tipo`, tipo)
            heroData.push({
                id,
                title,
                subtitle,
                image,
                url,
                enabled,
                tag,
                tipo,
                color
            })
        })

        resultado = {
            status: 200,
            result: heroData
        }
        res.send(resultado)
    }
})

module.exports = DetallesOfer