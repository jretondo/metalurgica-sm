const express = require('express')
const PreciosCorreo = express()
const Consultador = require("../../../../database/Consultador")

PreciosCorreo.get('/test/PreciosCorreo', async (req, res) => {
    const query = Consultador()
    const sql1 = ` SELECT * FROM correo_precios WHERE domicilio = '0' ORDER BY peso, zona `
    const sql2 = ` SELECT * FROM correo_precios WHERE domicilio = '1' ORDER BY peso, zona `
    let result1
    let result2

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000
        })
    } finally {
        try {
            result2 = await query({
                sql: sql2,
                timeout: 2000
            })
        } finally {
            res.send({
                status: 200,
                result: {
                    'Retiro': result1,
                    'Domicilio': result2
                }
            })
        }
    }
})

module.exports = PreciosCorreo