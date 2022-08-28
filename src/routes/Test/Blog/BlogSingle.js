const express = require('express')
const BlogSingle = express()
const Consultador = require("../../../../database/Consultador")
const FormatDateStr = require("../../../lib/Funciones/FormatDate2")

BlogSingle.get("/test/blog-single/:id", async (req, res) => {

    const idPost = req.params.id
    const sql1 = `SELECT * FROM tb_post_blog WHERE id = ?`
    let resultSql
    const query = Consultador()
    let resultado
    let lista = []

    try {
        resultSql = await query({
            sql: sql1,
            timeout: 2000,
            values: [idPost]
        });
    } finally {

        if (resultSql.length > 0) {
            const total = resultSql.length
            let actual = 0

            resultSql.map(async posteo => {
                const id = posteo.id
                const miniImage = posteo.min_img
                const bigImg = posteo.big_img
                const title = posteo.title
                const date = new Date(posteo.date)
                const dateStr = FormatDateStr(date)
                const shortDescr = posteo.short_descr
                const fullDescr = posteo.text_html
                const videoBool = posteo.video_bool
                const videoUrl = posteo.video_url

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

                    const sql3 = `SELECT id FROM tb_post_blog WHERE id > ? ORDER BY id ASC limit 1`
                    let result3
                    let siguiente
                    try {
                        result3 = await query({
                            sql: sql3,
                            timeout: 2000,
                            values: [id]
                        });
                    } finally {
                        try {
                            siguiente = result3[0].id
                        } catch (error) {
                            siguiente = 0
                        }

                        let listaImg
                        let listImg2 = []
                        const sql4 = `SELECT * FROM tb_img_blog WHERE id_post = ?`
                        try {
                            listaImg = await query({
                                sql: sql4,
                                timeout: 2000,
                                values: [id]
                            });
                        } finally {

                            listaImg.map(imagen => {
                                const idImg = imagen.id
                                const urlimg = imagen.url_img
                                const descrBoolImg = imagen.descr_bool
                                const titleimg = imagen.title
                                const descrImg = imagen.descr

                                listImg2.push({
                                    "id": idImg,
                                    "urlImg": urlimg,
                                    "descrBool": descrBoolImg,
                                    "title": titleimg,
                                    "descrImg": descrImg
                                })
                            })


                            let comments
                            let comments2 = []
                            const sql5 = `SELECT * FROM tb_comment_blog WHERE id_post = ?`

                            try {
                                comments = await query({
                                    sql: sql5,
                                    timeout: 2000,
                                    values: [id]
                                });
                            } finally {
                                try {
                                    comments.map(comentario => {
                                        const nameComment = comentario.name
                                        const dateComent = comentario.date
                                        const dateCommentStr = FormatDateStr(dateComent)
                                        const comment = comentario.comment

                                        comments2.push({
                                            "name": nameComment,
                                            "date": dateCommentStr,
                                            "comment": comment
                                        })
                                    })
                                } catch (error) {
                                    comments2 = []
                                }

                                const sql6 = `SELECT id FROM tb_post_blog WHERE id < ? ORDER BY id DESC limit 1`
                                let result6
                                let anterior

                                try {
                                    result6 = await query({
                                        sql: sql6,
                                        timeout: 2000,
                                        values: [id]
                                    })
                                } finally {
                                    try {
                                        console.log('result6', result6)
                                        anterior = result6[0].id

                                    } catch (error) {
                                        anterior = 0
                                    }
                                    lista.push({
                                        "id": id,
                                        "ant": anterior,
                                        "desp": siguiente,
                                        "miniImg": miniImage,
                                        "bigImg": bigImg,
                                        "title": title,
                                        "date": dateStr,
                                        "shortDescr": shortDescr,
                                        "textHtml": fullDescr,
                                        "principal": false,
                                        "videoBool": videoBool,
                                        "videoUrl": videoUrl,
                                        "imgPost": [listImg2],
                                        "tag": [categorias],
                                        "comment": comments2
                                    })

                                    actual = actual + 1
                                    if (actual === total) {
                                        resultado = {
                                            status: 200,
                                            result: lista
                                        }
                                        res.send(resultado);
                                    }
                                }
                            }
                        }
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

module.exports = BlogSingle