const express = require('express')
const CambioEstadoCountD = express()
const Consultador = require("../../../../database/Consultador")

CambioEstadoCountD.post("/test/change-state-countd", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const activar = parseInt(request.activar)
    const sql1 = `UPDATE countdown_promo SET enabled = ?`
    let result1
    let respuesta

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [activar]
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

module.exports = CambioEstadoCountD