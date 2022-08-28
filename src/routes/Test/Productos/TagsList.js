const express = require('express')
const TagList = express()
const Consultador = require("../../../../database/Consultador")

TagList.get("/test/tags-list", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT DISTINCT tag FROM produscts_tags ORDER BY tag ASC`

    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000
        })
    } finally {
        let categorias = []
        const cantidad = result1.length - 1
        if (cantidad > 0) {
            result1.map(async (category, key) => {
                const categoria = category.tag

                categorias.push({
                    "tag": categoria
                })

                if (cantidad === key) {
                    resultado = {
                        status: 200,
                        result: categorias
                    }
                    res.send(resultado)
                }
            })
        } else {
            resultado = {
                status: 200,
                result: categorias
            }
            res.send(resultado)
        }

    }
})

module.exports = TagList