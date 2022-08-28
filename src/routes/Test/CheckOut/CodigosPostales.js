const express = require('express')
const CodigoPostal = express()
const Consultador = require("../../../../database/Consultador")

CodigoPostal.post('/test/CodigoPostal', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const ciudad = request.ciudad

    const sql = `SELECT DISTINCT cp FROM correo_sucursales WHERE localidad = ?`
    let result = []
    let resultado = []
    let respuesta = []

    try {
        result = await query({
            sql: sql,
            timeout: 2000,
            values: [ciudad]
        })
    } finally {
        try {
            result.map(item => {
                const codPostal = item.cp
                const dato = {
                    codPostal
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

module.exports = CodigoPostal