const express = require('express')
const EliminarCupon = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")

EliminarCupon.delete('/test/EliminarCupon/:id', async (req, res) => {
    const token = req.headers["x-access-token"]
    const query = Consultador()
    const idCupon = req.params.id
    const sql1 = ` DELETE FROM cupones_tb WHERE id = ? `
    let result1

    const isSecure = await SecureVerify(token)

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [idCupon]
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

module.exports = EliminarCupon
