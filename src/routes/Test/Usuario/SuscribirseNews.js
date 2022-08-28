const express = require('express')
const SuscrNews = express()
const Consultador = require("../../../../database/Consultador")
const formatDate = require('../../../lib/Funciones/FormatDate')

SuscrNews.post('/test/SuscrNews', async (req, res) => {
    const request = req.body
    const email = request.email

    const query = Consultador()
    const fecha = await formatDate(new Date(), "yyyy-mm-dd hor:min:seg")
    const sql1 = `INSERT INTO suscripciones (email, fecha) VALUES (?, ?)`
    let result1
    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [email, fecha]
        })
    } finally {
        let rowsAff1
        try {
            rowsAff1 = parseInt(result1.affectedRows)
        } catch (error) {
            rowsAff1 = 0
        }

        if (rowsAff1 > 0) {
            respuesta = {
                status: 200,
                result: "Registrado con éxito!"
            }
            res.send(respuesta);
        } else {
            respuesta = {
                status: 500,
                error: "Ya éxiste en la base de datos!"
            }
            res.send(respuesta);
        }
    }
})

module.exports = SuscrNews