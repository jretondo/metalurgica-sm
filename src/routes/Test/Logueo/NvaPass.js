const express = require('express')
const NvaPass = express()
const Contestador = require("../../../../database/Contestador")
const Encriptar = require('../../../lib/Funciones/Encriptador')

NvaPass.post("/test/nvaPass", async (req, res) => {
    const request = req.body
    const email = request.email
    const pass = request.pass
    const passToken = await Encriptar(pass)
    const sql = `UPDATE usuarios SET pass = ?, provisoria = '0' WHERE email = ?`
    Contestador(true, sql, [passToken, email], res, process.env.NAME_DB_TEST, "")
})

module.exports = NvaPass