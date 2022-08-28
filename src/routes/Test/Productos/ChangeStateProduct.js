const express = require('express')
const CambioEstadoProd = express()
const Consultador = require("../../../../database/Consultador")

CambioEstadoProd.post("/test/change-state-prod", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const idHero = request.id
    const activar = parseInt(request.activar)
    const sql1 = `UPDATE products_principal SET enabled = ? WHERE id = ?`
    let result1
    let respuesta

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [activar, idHero]
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

module.exports = CambioEstadoProd