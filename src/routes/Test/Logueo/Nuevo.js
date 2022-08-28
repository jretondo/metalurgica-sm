const express = require('express')
const NuevoPA = express()
const Contestador = require("../../../../database/Contestador")
var FormatDate = require("../../../lib/Funciones/FormatDate")
const SendEmail = require("../../../lib/Emails/SendEmail")
const Encriptar = require('../../../lib/Funciones/Encriptador')
const EmailBienvenida = require("../../../lib/Emails/Plantillas/Bienvenida")

NuevoPA.post("/test/new", async (req, res) => {

    const request = req.body
    const facebook = parseInt(request.facebook)
    const email = request.email
    const pass = request.pass
    const nombre = request.nombre
    const url_avatar = request.url_avatar
    const fecha_reg = new Date()
    const fecha_reg_format = FormatDate(fecha_reg, "yyyy-mm-dd hor:min:seg")
    const tokenPass = await Encriptar(pass)
    var emailToken = await Encriptar(email)

    emailToken = emailToken.replace(/[.*+?^${}()|[\]\\]/g, "5")
    const sql = "INSERT INTO usuarios (`email`, `nombre_compl`, `url_avatar`, `facebook`, `pass`, `id_facebook`, `token`, `bloqueado`, `mot_bloc`, `fecha_bloc`, `fecha_registro`, `ult_ingreso`, `email_face`, `provisoria`, `confirmado`) VALUES (?, ?, ?, '?', ?, '1', '1', '0', '', ?, ?, ?, ?, '0', ?);"

    if (facebook === 0) {
        SendEmail(process.env.SENDER_EMAIL_CONF, process.env.SENDER_EMAIL, email, "Nuevo Usuario", EmailBienvenida(process.env.TEST_HOST, process.env.TESTPORTJS, process.env.TEST_BRANCH, emailToken, nombre, "Bienvenido a Puerta Animal. Confirme su email por favor..."))
    }

    Contestador(true, sql, [email, nombre, url_avatar, facebook, tokenPass, fecha_reg_format, fecha_reg_format, fecha_reg_format, email, emailToken], res, process.env.NAME_DB_TEST, "")
})

module.exports = NuevoPA