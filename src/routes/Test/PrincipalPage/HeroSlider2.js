const express = require('express')
const HeroSlider = express()
const Consultador = require("../../../../database/Consultador")

HeroSlider.get("/test/get-hero-slide2", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT * FROM tb_hero_slider`

    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
        })
    } finally {
        let heroData = []
        const cantidadHero = parseInt(HeroSlider.length)
        if (cantidadHero > 0) {
            result1.map(heroSlide => {
                const id = heroSlide.id
                const title = heroSlide.title
                const subtitle = heroSlide.subtitle
                const image = heroSlide.image
                const url = heroSlide.link
                const enabled = heroSlide.enabled
                const color = heroSlide.color

                heroData.push({
                    id,
                    title,
                    subtitle,
                    image,
                    url,
                    enabled,
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
                status: 200,
                result: []
            }
            res.send(resultado)
        }

    }
})

module.exports = HeroSlider