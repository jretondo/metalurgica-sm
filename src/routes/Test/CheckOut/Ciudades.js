const express = require('express')
const CiudadesList = express()
const Consultador = require("../../../../database/Consultador")

CiudadesList.post('/test/CiudadesList', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const provincia = request.provincia
    const sql1 = `SELECT DISTINCT localidad FROM correo_sucursales WHERE provincia = ? ORDER BY localidad ASC`
    let result1
    let resultado = []
    let respuesta = []

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [provincia]
        })
    } finally {
        try {
            result1.map(item => {
                const localidad = item.localidad
                const dato = {
                    localidad
                }
                resultado.push(dato)
            })

            respuesta = {
                status: 200,
                result: resultado
            }
            res.send(respuesta);
        } catch (error) {
            respuesta = {
                status: 401,
                result: "",
                error: error
            }
            res.send(respuesta);
        }

    }
})

module.exports = CiudadesList