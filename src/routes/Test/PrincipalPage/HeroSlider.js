const express = require('express')
const HeroSlider = express()
const Consultador = require("../../../../database/Consultador")

HeroSlider.get("/test/get-hero-slide", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT * FROM tb_hero_slider WHERE enabled = '1'`

    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
        })
    } finally {
        let heroData = []

        if (result1.length > 0) {
            result1.map(heroSlide => {
                const id = heroSlide.id
                const title = heroSlide.title
                const subtitle = heroSlide.subtitle
                const image = heroSlide.image
                const url = heroSlide.link
                const color = heroSlide.color

                heroData.push({
                    id,
                    title,
                    subtitle,
                    image,
                    url,
                    color
                })
            })

            resultado = {
                status: 200,
                result: heroData
            }
            res.send(resultado)
        } else {
            resultado = {
                status: 500,
                result: []
            }
            res.send(resultado)
        }

    }
})

module.exports = HeroSlider