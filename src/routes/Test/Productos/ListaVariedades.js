const express = require('express')
const ListaVariedades = express()
const Consultador = require("../../../../database/Consultador")

ListaVariedades.post('/test/listavariedades', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const tipoVar = request.tipoVar

    const sql1 = `SELECT DISTINCT variedad FROM productos_variedades WHERE tipo = ? ORDER BY variedad ASC`
    let result1
    let respuesta = []
    let resultado = []

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [tipoVar]
        })
    } finally {
        if (result1.length > 0) {
            result1.map(variedad => {
                respuesta.push(variedad)
            })
            resultado = {
                status: 200,
                result: respuesta
            }
            res.send(resultado)
        } else {
            resultado = {
                status: 401,
                result: []
            }
            res.send(resultado)
        }
    }
})

module.exports = ListaVariedades