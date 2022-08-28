const express = require('express')
const FactEmail = express()
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../Global/Colors.json')
const Links = require('../../Global/Links.json')
const Names = require('../../Global/Names.json')

FactEmail.get('/emailV/FactEmail', async (req, res) => {

    const informationList = [{
        col1: 6,
        title1: "DNI",
        content1: "35092514",
        col2: 6,
        title2: "Tipo de envío",
        content2: "A domicilio"
    }, {
        col1: 12,
        title1: "Nombre completo",
        content1: "Retondo Javier Edgardo"
    }, {
        col1: 12,
        title1: "Dirección",
        content1: "Av. Emilio Olmos 324, Córdoba"
    }]

    const parrafosHead = [
        "En el presente email le adjuntamos la factura de su compra. A conrinuación le pasamos los datos de envío:"
    ]

    const datos2 = {
        Colors,
        Links,
        Names,
        //Particular
        //Head
        titlePage: "Confirmar Email",
        titleHead: "Hola Retondo Javier",
        parrafosHead: parrafosHead,

        //ActionBtn
        titleButton: "Haga click en el siguiente botón para confirmar su correo electrónico",
        textCall: "Confirmar Correo",
        redirectCall: "https://nekonet.com.ar",

        //InfoForm
        titleInfoForm: "Sus Datos",
        informationList: informationList,
    }

    ejs.renderFile(path.join(__dirname, '..', '..', '..', "views", "registrado.ejs"), function (err, data) {

        res.render('Emails/Templates/FactEmail.ejs', datos2);

    });

})

module.exports = FactEmail