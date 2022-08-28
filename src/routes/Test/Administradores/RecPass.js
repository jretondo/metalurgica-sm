const express = require('express')
const CambioEmail = express()
const Encriptador = require("../../../lib/Funciones/Encriptador")
const Consultador = require("../../../../database/Consultador")
const EmailRecuperarPass = require('../../../lib/Emails/JS/Plantillas/RecuperarPass')
const FormatFecha = require('../../../lib/Funciones/FormatDate2')
const SendEmail = require('../../../lib/Emails/SendEmail')

CambioEmail.post("/test/recpass", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const email = request.email
    const cadenaLarga = "QWERTYUIOPASDFGHJKLZXCVBNM12345678909876543210mnbvcxzlkjhgfdsapoiuytrewq"
    let nvaPass = ""
    let rndm = 0
    const fecha = new Date()
    const yearFull = fecha.getFullYear()
    const hour = parseInt(FormatFecha(fecha, "hor"))
    let saludo
    if (hour > 6 && hour < 13) {
        saludo = "Buenos días"
    } else if (hour > 13 && hour < 20) {
        saludo = "Buenas tardes"
    } else {
        saludo = "Buenas noches"
    }
    while (nvaPass.length < 10) {
        rndm = Math.round(Math.random() * 72)
        nvaPass = nvaPass + cadenaLarga.substring(rndm, (rndm + 1))
    }

    const passToken = await Encriptador(nvaPass)
    const sql1 = "UPDATE administradores SET pass = ?, provisoria = '1' WHERE email = ?"
    let result1
    let respuesta

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [passToken, email]
        })
    } finally {
        const rowsAff = parseInt(result1.affectedRows)
        if (rowsAff > 0) {
            SendEmail(process.env.SENDER_EMAIL_CONF_INFO, process.env.SENDER_EMAIL_INFO, email, "Recuperar contraseña", EmailRecuperarPass("https://nekonet.com.ar/images/logo.png", saludo, nvaPass, process.env.AYUDA_EMAIL, yearFull, process.env.INFO_EMAIL, process.env.LINK_IG, process.env.LINK_FB, process.env.LINK_TW, process.env.TEL_INT1, process.env.TEL_STR1))
            respuesta = {
                status: 200,
                result: result1
            }
            res.send(respuesta)
        } else {
            respuesta = {
                status: 500,
                result: "No se encontró el email colocado!"
            }
            res.send(respuesta)
        }
    }
})

module.exports = CambioEmail