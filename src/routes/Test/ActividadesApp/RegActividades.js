const express = require('express')
const jwt = require("jsonwebtoken")
const NvaActividad = express()
const Consultador = require("../../../../database/Consultador")
const formatDate = require('../../../lib/Funciones/FormatDate')

NvaActividad.post("/test/nva-actividad", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const actividad = request.actividad
    const token = req.headers['x-access-token'];
    const ahoraDate = new Date()
    const ahoraStr = formatDate(ahoraDate, "yyyy-mm-dd hor:min:seg")
    const sql1 = `INSERT INTO actividad_app (fecha, usuario, descr) VALUES (?, ?, ?)`
    let result1
    let respuesta

    if (!token) {
        respuesta = {
            status: 500,
            error: "No tiene los permisos para esta operación"
        }
        res.json(respuesta)
    } else {
        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            const user = decoded.user

            try {
                result1 = await query({
                    sql: sql1,
                    timeout: 2000,
                    values: [ahoraStr, user, actividad]
                })
            } finally {
                const rowsAff = parseInt(result1.affectedRows)

                if (rowsAff > 0) {
                    respuesta = {
                        status: 200,
                        result: result1
                    }
                    res.json(respuesta)

                } else {
                    respuesta = {
                        status: 500,
                        error: "No tiene los permisos para esta operación"
                    }
                    res.json(respuesta)
                }
            }

        } catch (error) {
            respuesta = {
                status: 500,
                error: "No tiene los permisos para esta operación"
            }
            res.json(respuesta)
        }
    }

})

module.exports = NvaActividad