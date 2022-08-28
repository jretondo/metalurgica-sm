const express = require('express')
const ProvinciasList = express()
const Consultador = require("../../../../database/Consultador")

ProvinciasList.get('/test/ProvinciasList', async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT provincia, cod_prov, zona FROM correo_zonas ORDER BY provincia`
    let result1
    let resultado = []
    let respuesta = []

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000
        })
    } finally {
        try {
            result1.map(item => {
                const provincia = item.provincia
                const codigo = item.codigo
                const zona = item.zona
                const dato = {
                    provincia,
                    codigo,
                    zona
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

module.exports = ProvinciasList