const express = require('express')
const verificaEmail = express()
const Contestador = require("../../../../database/Contestador")

verificaEmail.post("/test/verificaEmail", async (req, res) => {

    const request = req.body
    const email = request.email
    const sqlBuscarEmail = "SELECT COUNT(*) AS CANT FROM usuarios WHERE email = ?"
    Contestador(true, sqlBuscarEmail, [email], res, process.env.NAME_DB_TEST, "")
})

module.exports = verificaEmail