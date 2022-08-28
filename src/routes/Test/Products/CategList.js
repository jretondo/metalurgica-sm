const express = require('express')
const CatList = express()
const Consultador = require("../../../../database/Consultador")

CatList.get("/test/category-list", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT DISTINCT category FROM products_principal ORDER BY category ASC`
    const sql2 = `SELECT DISTINCT subcategory FROM products_principal WHERE category = ? ORDER BY subcategory ASC`

    let result1
    let result2

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000
        })
    } finally {
        let categorias = []
        const cantidad = result1.length - 1

        result1.map(async (category, key) => {
            const categoria = category.category

            try {
                result2 = await query({
                    sql: sql2,
                    timeout: 2000,
                    values: [categoria]
                })
            } finally {
                let subCat = []

                result2.map(subCategory => {
                    const subCategoria = subCategory.subcategory
                    subCat.push(subCategoria)
                })

                categorias.push({
                    "category": categoria,
                    "subCategory": subCat
                })

                if (cantidad === key) {
                    resultado = {
                        status: 200,
                        result: categorias
                    }
                    res.send(resultado)
                }
            }
        })
    }
})

module.exports = CatList