const express = require('express')
const NvoCupon = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")

NvoCupon.post('/test/NvoCupon', async (req, res) => {
    const token = req.headers["x-access-token"]
    const query = Consultador()
    const data = req.body
    const nombre = data.nombre
    const tipo = parseInt(data.tipo)
    const montoMin = parseFloat(data.montoMin)
    const vtoCupon = data.vtoCupon
    const stock = parseInt(data.stock)

    let porc = parseInt(data.porc)
    let montoDesc = parseFloat(data.montoDesc)
    let descMax = parseFloat(data.descMax)

    if (isNaN(porc)) {
        porc = 0
    }
    if (isNaN(montoDesc)) {
        montoDesc = 0
    }
    if (isNaN(descMax)) {
        descMax = 0
    }

    const isSecure = await SecureVerify(token)

    const sql1 = ` INSERT INTO cupones_tb (cupon, desc_tipo, porc, monto_dec, desc_max, monto_min, max_cant, vto_cupon) VALUES (?, ?, ?, ?, ?, ?, ?, ?) `
    let result1

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [nombre, tipo, porc, montoDesc, descMax, montoMin, stock, vtoCupon]
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

module.exports = NvoCupon