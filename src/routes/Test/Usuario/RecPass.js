const express = require('express')
const CambioEmailUsu = express()
const Encriptador = require("../../../lib/Funciones/Encriptador")
const FormatFecha = require('../../../lib/Funciones/FormatDate2')
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../../Global/Colors.json')
const Links = require('../../../Global/Links.json')
const Names = require('../../../Global/Names.json')
const Consultador = require("../../../../database/Consultador")
const SendEmail = require('../../../lib/Emails/SendEmail');

CambioEmailUsu.post("/test/recpassUsu2", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const email = request.email
    console.log(`email`, email)
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
    const sql1 = "UPDATE usuarios SET pass = ?, provisoria = '1' WHERE email = ?"
    const sql2 = `SELECT nombre, apellido FROM usuarios WHERE email = ?`
    let result1
    let result2
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

            try {
                result2 = await query({
                    sql: sql2,
                    timeout: 2000,
                    values: [email]
                })
            } finally {

                const nombre = result2[0].nombre
                const apellido = result2[0].apellido

                const parrafosHead = [
                    "Por cuestiones de seguridad le pasamos la contraseña por este medio."
                ]

                const datos2 = {
                    Colors,
                    Links,
                    Names,
                    //Particular
                    //Head
                    titlePage: "Recuperar Contraseña",
                    titleHead: "Hola " + nombre + " " + apellido,
                    parrafosHead: parrafosHead,

                    //ActionBtn
                    titleButton: "A continuación tiene su contraseña provisoria",
                    textCall: nvaPass,
                    textFoother: "Una vez que ingrese va a poder cambiar la contraseña por una que recuerde."
                }

                await ejs.renderFile(path.join("views", "Emails", "Templates", "ForgotPass.ejs"), datos2, async function (err, data) {
                    if (err) {
                        respuesta = {
                            status: 401,
                            error: "Email no envíado!"
                        }
                        res.send(respuesta);
                    } else {
                        await SendEmail("info@cordobabaitcast.com.ar", "Córdoba Baitcast <info@cordobabaitcast.com.ar>", email, "Recuperar Contraseña", data)
                        respuesta = {
                            status: 200,
                            error: "Email envíado con éxito!"
                        }
                        res.send(respuesta);
                    }
                });
            }

        } else {
            respuesta = {
                status: 500,
                result: "No se encontró el email colocado!"
            }
            res.send(respuesta)
        }
    }
})

module.exports = CambioEmailUsu