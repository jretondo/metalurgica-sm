const express = require('express')
const NewComment = express()
const Consultador = require("../../../../database/Consultador")
const formatDate = require("../../../lib/Funciones/FormatDate")

NewComment.post("/test/new-comment", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const idProd = request.idProd
    const nombre = request.nombre
    const email = request.email
    const opinion = request.opinion
    const puntaje = request.puntaje
    const respuestaOp = request.respuestaOp
    const idComentOriginal = request.idComentOriginal
    const fecha = formatDate(new Date(), "yyyy-mm-dd")
    const sql1 = `INSERT INTO product_comments (name, email, rating, id_prod, review, response, id_original_comment, date, leido) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '0')`
    const sql2 = `SELECT SUM(rating) AS suma, COUNT(*) AS conteo FROM product_comments WHERE id_prod = ?`
    const sql3 = `UPDATE products_principal SET rating = ? WHERE id = ?`

    let result1
    let result2
    let result3
    let respuesta = []

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [nombre, email, puntaje, idProd, opinion, respuestaOp, idComentOriginal, fecha]
        })
    } finally {
        const rowsAff = parseInt(result1.affectedRows)

        if (rowsAff > 0) {
            if (parseInt(respuestaOp) === 0) {
                try {
                    result2 = await query({
                        sql: sql2,
                        timeout: 2000,
                        values: [idProd]
                    })
                } finally {
                    const cantRes2 = parseInt(result2.length)
                    if (cantRes2 > 0) {
                        const cantAnt = parseInt(result2[0].conteo)
                        let nvoRating
                        if (cantAnt === 0) {
                            nvoRating = puntaje
                        } else {
                            const sumaAnt = parseInt(result2[0].suma)
                            nvoRating = parseInt((sumaAnt + puntaje) / (cantAnt + 1))
                        }

                        try {
                            result3 = await query({
                                sql: sql3,
                                timeout: 2000,
                                values: [nvoRating, idProd]
                            })
                        } finally {

                        }
                    }
                }
            }
            respuesta = {
                status: 200,
                result: ""
            }

            res.send(respuesta);
        } else {
            respuesta = {
                status: 403,
                error: "Error inesperado. Intente nuevamente."
            }

            res.send(respuesta);
        }
    }
})

module.exports = NewComment