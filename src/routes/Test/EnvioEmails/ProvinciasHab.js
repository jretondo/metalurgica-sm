const express = require('express')
const ProvHab = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")

ProvHab.get('/test/ProvHab', async (req, res) => {
    const token = req.headers["x-access-token"]
    const query = Consultador()
    const sql1 = ` SELECT distinct provincia FROM usuarios WHERE provincia <> "" ORDER BY provincia `
    let result1
    let respuesta = []
    const isSecure = await SecureVerify(token)

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000
            })
        } finally {
            console.log(`result1`, result1)
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

module.exports = ProvHab