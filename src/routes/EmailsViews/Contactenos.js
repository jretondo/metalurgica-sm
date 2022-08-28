const express = require('express')
const Contactenos = express()
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../Global/Colors.json')
const Links = require('../../Global/Links.json')
const Names = require('../../Global/Names.json')

Contactenos.get('/emailV/Contactenos', async (req, res) => {

    const informationList = [{
        col1: 6,
        title1: "Nombre",
        content1: "Retondo Javier",
        col2: 6,
        title2: "Email",
        content2: "jretondo90@gmail.com"
    }, {
        col1: 12,
        title1: "Asunto",
        content1: "Algún asunto interesante!"
    }, {
        col1: 12,
        title1: "Mensasje",
        content1: "svasgasgasgasg asgasgasgasgasgasg asgasfagasgasg wfwag"
    }]

    const parrafosHead1 = [
        "Usted ha envíado un mensaje de contacto a Córdoba Baitcast, a la brevedad lo estaremos contactando:"
    ]
    const parrafosHead2 = [
        "Alguien ha intentado contactarse contigo desde el sitio web. A continuación los datos del contacto:"
    ]

    const datos2 = {
        Colors,
        Links,
        Names,
        //Particular
        //Head
        titlePage: "Confirmar Email",
        titleHead: "Hola Retondo Javier",
        parrafosHead: parrafosHead1,

        //InfoForm
        titleInfoForm: "Mensaje",
        informationList: informationList,
    }

    ejs.renderFile(path.join(__dirname, '..', '..', '..', "views", "registrado.ejs"), function (err, data) {

        res.render('Emails/Templates/Contactenos.ejs', datos2);

    });

})

module.exports = Contactenos