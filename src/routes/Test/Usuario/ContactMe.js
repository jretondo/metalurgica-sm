const express = require('express')
const ContactMe = express()
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../../Global/Colors.json')
const Links = require('../../../Global/Links.json')
const Names = require('../../../Global/Names.json')
const SendEmail = require('../../../lib/Emails/SendEmail')

ContactMe.post('/test/ContactMe', async (req, res) => {
    const request = req.body
    const nombre = request.nombre
    const email = request.email
    const asunto = request.asunto
    const mensaje = request.mensaje
    const telefono = request.telefono

    const informationList = [{
        col1: 6,
        title1: "Nombre",
        content1: nombre,
        col2: 6,
        title2: "Telefóno",
        content2: telefono
    }, {
        col1: 12,
        title1: "Email",
        content1: email
    }, {
        col1: 12,
        title1: "Asunto",
        content1: asunto
    }, {
        col1: 12,
        title1: "Mensasje",
        content1: mensaje
    }]

    const parrafosHead1 = [
        "Usted ha envíado un mensaje de contacto a Córdoba Baitcast, a la brevedad lo estaremos contactando:"
    ]
    const parrafosHead2 = [
        "Alguien ha intentado contactarse contigo desde el sitio web. A continuación los datos del contacto:"
    ]

    const datos1 = {
        Colors,
        Links,
        Names,
        //Particular
        //Head
        titlePage: "Confirmar Email",
        titleHead: "Hola " + nombre,
        parrafosHead: parrafosHead1,

        //InfoForm
        titleInfoForm: "Mensaje:",
        informationList: informationList,
    }

    const datos2 = {
        Colors,
        Links,
        Names,
        //Particular
        //Head
        titlePage: "Confirmar Email",
        titleHead: "Hola Marcelo",
        parrafosHead: parrafosHead2,

        //InfoForm
        titleInfoForm: "Mensaje:",
        informationList: informationList,
    }

    await ejs.renderFile(path.join("views", "Emails", "Templates", "Contactenos.ejs"), datos1, async function (err, data) {
        if (err) {
            respuesta = {
                status: 401,
                error: "Email no envíado!"
            }
            res.send(respuesta);
        } else {
            await SendEmail("info@cordobabaitcast.com.ar", "Córdoba Baitcast <info@cordobabaitcast.com.ar>", email, "Contacto Web - Córdoba Baitcast", data)
        }
    });

    await ejs.renderFile(path.join("views", "Emails", "Templates", "Contactenos.ejs"), datos2, async function (err, data) {
        if (err) {
            respuesta = {
                status: 401,
                error: "Email no envíado!"
            }
            res.send(respuesta);
        } else {
            await SendEmail("info@cordobabaitcast.com.ar", "Córdoba Baitcast <info@cordobabaitcast.com.ar>", "info@cordobabaitcast.com.ar", "Contacto Web", data)

            respuesta = {
                status: 200,
                error: "Email envíado con éxito!"
            }
            res.send(respuesta);
        }
    });
})

module.exports = ContactMe