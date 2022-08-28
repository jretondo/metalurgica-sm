const express = require('express')
const CatListAcc = express()
const Consultador = require("../../../../database/Consultador")

CatListAcc.get("/test/category-list-acc", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT DISTINCT category FROM products_principal WHERE ind = '0' ORDER BY category ASC`

    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000
        })
    } finally {
        let categorias = []
        const cantidad = result1.length - 1
        if (cantidad < 0) {
            resultado = {
                status: 200,
                result: categorias
            }
            res.send(resultado)
        } else {

            result1.map(async (category, key) => {
                const categoria = category.category

                categorias.push({
                    "category": categoria
                })

                if (cantidad === key) {
                    resultado = {
                        status: 200,
                        result: categorias
                    }
                    res.send(resultado)
                }
            })
        }

    }
})

module.exports = CatListAcc