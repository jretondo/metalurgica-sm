const express = require('express')
const ReenvioVerif = express()
const Contestador = require("../../../../database/Contestador")
const SendEmail = require("../../../lib/Emails/SendEmail")
const Encriptar = require('../../../lib/Funciones/Encriptador')
const EmailBienvenida = require("../../../lib/Emails/Plantillas/Bienvenida")

ReenvioVerif.post("/test/renvVerif", async (req, res) => {

    const request = req.body
    const facebook = parseInt(request.facebook)
    const email = request.email

    var emailToken = await Encriptar(email)
    emailToken = emailToken.replace(/[.*+?^${}()|[\]\\]/g, "5")
    const sql = "UPDATE usuarios SET confirmado = ? WHERE email = ? AND facebook = ?"

    if (facebook === 0) {
        SendEmail(process.env.SENDER_EMAIL_CONF, process.env.SENDER_EMAIL, email, "Nuevo Usuario", EmailBienvenida(process.env.TEST_HOST, process.env.TESTPORTJS, process.env.TEST_BRANCH, emailToken, "", "Bienvenido a Puerta Animal. Confirme su email por favor..."))
    }

    Contestador(true, sql, [emailToken, email, facebook], res, process.env.NAME_DB_TEST, "")
})

module.exports = ReenvioVerif