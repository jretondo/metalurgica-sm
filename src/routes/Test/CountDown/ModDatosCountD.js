const express = require('express')
const ModCountD = express()
const Consultador = require("../../../../database/Consultador")

ModCountD.post("/test/mod-countd-id", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const date = request.date
    const title = request.title
    const date2 = date + " 23:59:59"
    const sql1 = `UPDATE countdown_promo SET date_limit = ?, title = ?`
    let result1
    let respuesta

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [date2, title]
        })
    } finally {

        const rowsAff = parseInt(result1.affectedRows)

        if (rowsAff > 0) {
            respuesta = {
                status: 200,
                result: result1
            }
            res.send(respuesta)
        } else {
            respuesta = {
                status: 500,
                error: "No se encontró el email colocado!"
            }
            res.send(respuesta)
        }
    }

})

module.exports = ModCountD