const express = require('express')
const UltVisitas = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")

UltVisitas.post('/test/UltVisitas', async (req, res) => {
    const query = Consultador()
    const token = req.headers['x-access-token']
    const isSecure = await SecureVerify(token)
    const palabra = "%" + req.body.palabra + "%"
    const busquedaBool = req.body.busquedaBool
    let sql1 = ` SELECT * FROM actividad_usu ORDER BY momento DESC LIMIT 15 `
    if (busquedaBool) {
        sql1 = ` SELECT distinct * FROM actividad_usu WHERE ip_usu LIKE ? GROUP BY ip_usu, descr_tipo ORDER BY momento DESC LIMIT 15 `
        values1 = [palabra]

    } else {
        sql1 = ` SELECT distinct * FROM actividad_usu  GROUP BY ip_usu, descr_tipo ORDER BY momento DESC LIMIT 15 `
        values1 = []
    }

    let result1
    let respuesta = []

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: values1
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
                    status: 501,
                    error: "No hay visitas!"
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

module.exports = UltVisitas