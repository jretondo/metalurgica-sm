const express = require('express')
const GetLocation2 = express()
const GetDirect = require("../../../lib/Funciones/GetDirectionGoogle")
const SecureVerify = require("../../../lib/Funciones/SecureVerify")

GetLocation2.post('/test/GetLocation2', async (req, res) => {
    const token = req.headers['x-access-token']
    const latitud = req.body.latitud
    const longitud = req.body.longitud
    let respuesta = []
    let resultado = []
    const isSecure = await SecureVerify(token)
    if (isSecure) {
        if (latitud !== 0) {
            let arraDirect = await GetDirect(latitud, longitud)
            const status = arraDirect.status
            if (status === "OK") {
                const direccionComp = arraDirect.results[0].address_components

                resultado = {
                    direccionComp
                }
                respuesta = {
                    status: 200,
                    result: resultado
                }
                res.send(respuesta)
            }
        } else {
            respuesta = {
                status: 501,
                error: "No hay coordenadas"
            }
            res.send(respuesta)
        }
    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }
})

module.exports = GetLocation2
