const express = require('express')
const SubCatListAcc = express()
const Consultador = require("../../../../database/Consultador")

SubCatListAcc.get("/test/subcategory-list-acc", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT DISTINCT subcategory FROM products_principal WHERE ind = '0' ORDER BY subcategory ASC`

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
                const categoria = category.subcategory

                categorias.push({
                    "subCategory": categoria
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

module.exports = SubCatListAcc