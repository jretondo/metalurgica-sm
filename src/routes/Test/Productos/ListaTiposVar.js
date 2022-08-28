const express = require('express')
const ListaTiposVar = express()
const Consultador = require("../../../../database/Consultador")

ListaTiposVar.get('/test/tiposvar', async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT DISTINCT tipo FROM productos_variedades`
    let result1
    let respuesta = []
    let resultado = []

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000
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

module.exports = ListaTiposVar
