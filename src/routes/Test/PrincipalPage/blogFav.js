const express = require('express')
const BlogFav = express()
const Consultador = require("../../../../database/Consultador")

BlogFav.get("/test/blog-fav", async (req, res) => {

    const sql1 = `SELECT * FROM tb_post_blog WHERE principal = '1'`
    let resultSql
    const query = Consultador()
    let resultado
    let lista = []

    try {
        resultSql = await query({
            sql: sql1,
            timeout: 2000,
        });
    } finally {

        if (resultSql.length > 0) {
            const total = resultSql.length
            let actual = 0

            resultSql.map(async posteo => {
                const id = posteo.id
                const image = posteo.min_img
                const title = posteo.title
                const url = "/blog-details-standard/" + id
                const sql2 = `SELECT cat FROM tb_cat_blog WHERE id_post = ?`
                let categories = []

                try {
                    categories = await query({
                        sql: sql2,
                        timeout: 2000,
                        values: [id]
                    });
                } finally {
                    let categorias = ""

                    categories.map((cat, key) => {
                        if (key === 0) {
                            categorias = cat.cat
                        } else {
                            categorias = categorias + ", " + cat.cat
                        }

                    })
                    lista.push({ "id": id, "image": image, "category": [categorias], "title": title, "url": url })
                    actual = actual + 1
                    if (actual === total) {
                        resultado = {
                            status: 200,
                            result: lista
                        }
                        res.send(resultado);
                    }
                }
            })
        } else {
            resultado = {
                status: 500
            }
            res.send(resultado);
        }
    }
})

module.exports = BlogFav