const express = require('express')
const formatDate = require('../../../lib/Funciones/FormatDate')
const DeleteOldVisit = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")

DeleteOldVisit.delete('/test/DeleteOldVisit', async (req, res) => {
    const token = req.headers['x-access-token']
    const query = Consultador()
    let respuesta = []
    const isSecure = await SecureVerify(token)
    const ahora = new Date()
    const ahoraStr = formatDate(ahora, "yyyy-mm") + "-01"
    const ahora2 = new Date(ahoraStr)
    ahora2.setMonth(ahora2.getMonth() - 6)
    const antesStr = formatDate(ahora2, "yyyy-mm-dd")

    const sql = ` DELETE FROM actividad_usu WHERE momento < ? `
    let result

    if (isSecure) {
        try {
            result = await query({
                sql: sql,
                timeout: 2000,
                values: [antesStr]
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
                    result: ""
                }
                res.send(respuesta)
            } else {
                respuesta = {
                    status: 501,
                    error: "No hay datos!"
                }
                res.send(respuesta)
            }
        }
    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }
})

module.exports = DeleteOldVisit