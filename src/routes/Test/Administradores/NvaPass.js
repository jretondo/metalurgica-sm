const express = require('express')
const CambioEmail = express()
const jwt = require("jsonwebtoken")
const Encriptador = require("../../../lib/Funciones/Encriptador")
const Consultador = require("../../../../database/Consultador")

CambioEmail.post("/test/nvapass", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const nvaPass = request.nvaPass
    const nvaPassEncr = Encriptador(nvaPass)
    const token = req.headers['x-access-token']
    const decoded = await jwt.verify(token, process.env.SECRET)
    const sql1 = `UPDATE administradores SET pass = ?, provisoria = '0' WHERE usuario = ? AND admin = ?`
    let result1
    let respuesta

    if (decoded) {
        const user = decoded.user
        const admin = decoded.admin

        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [nvaPassEncr, user, admin]
            })
        } finally {
            respuesta = {
                status: 200,
                result: result1
            }
            res.send(respuesta);
        }
    } else {
        respuesta = {
            status: 500,
            error: "Sesión vencida"
        }
        res.send(respuesta);
    }
})

module.exports = CambioEmail