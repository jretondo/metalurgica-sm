const express = require('express')
const ReenviarEmailConfirm = express()
const Consultador = require("../../../../database/Consultador")
const Colors = require('../../../Global/Colors.json')
const Links = require('../../../Global/Links.json')
const Names = require('../../../Global/Names.json')
const ejs = require("ejs")
const path = require('path')
const FormatDate = require("../../../lib/Funciones/FormatDate")
const SendEmail = require("../../../lib/Emails/SendEmail")

ReenviarEmailConfirm.post('/test/ReenviarEmailConfirm', async (req, res) => {
    const query = Consultador()
    const email = req.body.email
    const sql = ` SELECT token, nombre, apellido FROM usuarios WHERE email = ? `
    let result1

    try {
        result1 = await query({
            sql: sql,
            timeout: 2000,
            values: [email]
        })
    } finally {
        const token = result1[0].token
        const nombre = result1[0].nombre
        const apellido = result1[0].apellido

        const fecha = new Date()
        const hour = parseInt(FormatDate(fecha, "hor"))
        let saludo
        if (hour > 6 && hour < 13) {
            saludo = "Buenos días"
        } else if (hour > 13 && hour < 20) {
            saludo = "Buenas tardes"
        } else {
            saludo = "Buenas noches"
        }

        const informationList = [{
            col1: 12,
            title1: "Nombre",
            content1: nombre + " " + apellido,

        }, {
            col1: 12,
            title1: "Casilla de Email",
            content1: email
        }]

        const parrafosHead = [
            "El equipo de Córdoba Baitcast le da la bienvenida a la mejor plataforma de compras de productos de pesca."
        ]

        const datos = {
            Colors,
            Links,
            Names,
            //Particular
            //Head
            titlePage: "Confirmar Email",
            titleHead: saludo + " " + nombre,
            parrafosHead: parrafosHead,

            //ActionBtn
            titleButton: "Haga click en el siguiente botón para confirmar su correo electrónico",
            textCall: "Confirmar Correo",
            redirectCall: "http://localhost:3006/test/ConfirmEmail/" + token,

            //InfoForm
            titleInfoForm: "Sus Datos",
            informationList: informationList,
        }

        await ejs.renderFile(path.join(__dirname, "..", "..", "..", "..", "views", "Emails", "Templates", "ConfirmEmail.ejs"), datos, async function (err, data) {
            if (err) {
                respuesta = {
                    status: 401,
                    error: "Email no envíado!"
                }
                res.send(respuesta);
            } else {
                await SendEmail(process.env.SENDER_EMAIL_CONF_INFO, process.env.SENDER_EMAIL_INFO, email, "Confirmación de email", data)
                respuesta = {
                    status: 200,
                    error: "Email envíado con éxito!"
                }
                res.send(respuesta);
            }
        });

    }
})

module.exports = ReenviarEmailConfirm