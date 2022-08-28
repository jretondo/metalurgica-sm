const express = require('express')
const RecuperarPass = express()
const Contestador = require("../../../../database/Contestador")
const SendEmail = require("../../../lib/Emails/SendEmail")
const Encriptar = require('../../../lib/Funciones/Encriptador')
const EmailRecuperarPass = require("../../../lib/Emails/Plantillas/RecuperarPass")

RecuperarPass.post("/test/recPass", async (req, res) => {

    const request = req.body
    const facebook = request.facebook
    const email = request.email
    const cadenaLarga = "QWERTYUIOPASDFGHJKLZXCVBNM12345678909876543210mnbvcxzlkjhgfdsapoiuytrewq"

    let nvaPass = ""
    let rndm = 0

    while (nvaPass.length < 10) {
        rndm = Math.round(Math.random() * 72)
        nvaPass = nvaPass + cadenaLarga.substring(rndm, (rndm + 1))
    }
    const passToken = await Encriptar(nvaPass)
    SendEmail(process.env.SENDER_EMAIL_CONF, process.env.SENDER_EMAIL, email, "Recuperar contraseña", EmailRecuperarPass(nvaPass, "Nos comunicamos con usted para que pueda recuperar su contraseña"))
    const sql = "UPDATE usuarios SET pass = ?, provisoria = '1' WHERE email = ? AND facebook = ? AND confirmado = '1'"
    Contestador(true, sql, [passToken, email, facebook], res, process.env.NAME_DB_TEST, "")
})

module.exports = RecuperarPass