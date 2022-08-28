const express = require('express')
const SucursalesList = express()
const Consultador = require("../../../../database/Consultador")

SucursalesList.post('/test/SucursalesList', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const provincia = request.provincia
    const ciudad = request.ciudad
    let sql1
    let consulta
    if (ciudad === "") {
        sql1 = `SELECT nombre_suc, calle, alt, cod_suc, localidad FROM correo_sucursales WHERE provincia = ? ORDER BY nombre_suc ASC`
        consulta = provincia
    } else {
        sql1 = `SELECT nombre_suc, calle, alt, cod_suc, localidad FROM correo_sucursales WHERE localidad = ? ORDER BY nombre_suc ASC`
        consulta = ciudad
    }
    let result1
    let resultado = []
    let respuesta = []

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [consulta]
        })
    } finally {
        try {
            result1.map(item => {
                const nombre = item.nombre_suc
                const calle = item.calle
                const alt = item.alt
                const codSuc = item.cod_suc
                const localidad = item.localidad
                const dato = {
                    nombre,
                    calle,
                    alt,
                    codSuc,
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

module.exports = SucursalesList