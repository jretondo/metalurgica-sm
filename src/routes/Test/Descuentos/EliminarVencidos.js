const express = require('express')
const EliminarVencidos = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")
const formatDate = require("../../../lib/Funciones/FormatDate")

EliminarVencidos.delete('/test/EliminarVencidos', async (req, res) => {
    const token = req.headers["x-access-token"]
    const query = Consultador()
    const ahora = formatDate(new Date(), "yyyy-mm-dd hor:min:seg")
    const sql1 = ` DELETE FROM cupones_tb WHERE vto_cupon < ? OR max_cant = '0' `
    let result1

    const isSecure = await SecureVerify(token)

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [ahora]
            })
        } finally {
            let rowsAff1
            try {
                rowsAff1 = parseInt(result1.affectedRows)
            } catch (error) {
                rowsAff1 = 0
            }

            if (rowsAff1 > 0) {
                respuesta = {
                    status: 200,
                    result: ""
                }
                res.send(respuesta)
            } else {
                respuesta = {
                    status: 500,
                    error: "Error inesperado o cupón repetido!"
                }
                res.send(respuesta)
            }
        }
    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }
})

module.exports = EliminarVencidos