const express = require('express')
const CodSeguimiento = express()
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../Global/Colors.json')
const Links = require('../../Global/Links.json')
const Names = require('../../Global/Names.json')

CodSeguimiento.get('/emailV/CodSeguimiento', async (req, res) => {

    const parrafosHead = [
        "Acabamos de envíar tu pedido!"
    ]

    const datos2 = {
        Colors,
        Links,
        Names,
        //Particular
        //Head
        titlePage: "Recuperar Contraseña",
        titleHead: "Hola Retondo Javier",
        parrafosHead: parrafosHead,

        //ActionBtn
        titleButton: "A continuación le pasamos el código de seguimiento de Correo Argentino",
        textCall: "CP 1351313131 AR",
        textFoother: "Ingrese su código en la siguiente página de Correo Argentino: <br> <a href='https://www.correoargentino.com.ar/formularios/e-commerce' target='_blank'>Correo Argentino - Seguimiento de paqueteria e-commerce</a>"
    }

    ejs.renderFile(path.join(__dirname, '..', '..', '..', "views", "registrado.ejs"), function (err, data) {

        res.render('Emails/Templates/ForgotPass.ejs', datos2);

    });

})

module.exports = CodSeguimiento