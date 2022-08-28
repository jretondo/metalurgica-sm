const express = require('express')
const CiudadesHab = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")

CiudadesHab.post('/test/CiudadesHab', async (req, res) => {
    const token = req.headers["x-access-token"]
    const query = Consultador()
    const prov = req.body.prov
    const sql1 = ` SELECT DISTINCT ciudad FROM usuarios WHERE provincia = ? ORDER BY ciudad `
    let result1
    let respuesta = []
    const isSecure = await SecureVerify(token)

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [prov]
            })
        } finally {
            let cant
            try {
                cant = parseInt(result1.length)
            } catch (error) {
                cant = 0
            }

            if (cant > 0) {
                respuesta = {
                    status: 200,
                    result: result1
                }
                res.send(respuesta)
            } else {
                respuesta = {
                    status: 500,
                    error: "No hay casillas!"
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

module.exports = CiudadesHab