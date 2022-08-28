const express = require('express')
const PrevEmailLibre = express()
const SecureVerify = require("../../../../lib/Funciones/SecureVerify")
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../../../Global/Colors.json')
const Links = require('../../../../Global/Links.json')
const Names = require('../../../../Global/Names.json')

PrevEmailLibre.post('/test/PrevEmailLibre', async (req, res) => {
    const token = req.headers["x-access-token"]
    const prevText = req.body.prevText
    const titulo = req.body.titulo
    const isSecure = await SecureVerify(token)

    if (isSecure) {
        const datos2 = {
            Colors,
            Links,
            Names,
            //Particular
            //Head
            titlePage: "Nuevo Email",
            titleHead: titulo,
            parrafosHead: [prevText],

            //ActionBtn                   
            textFoother: ``
        }

        ejs.renderFile(path.join("views", "registrado.ejs"), function (err, data) {
            res.render('Emails/Templates/EmailLibre.ejs', datos2)
        });
    } else {
        res.send("Error en el formato o no hay cupñon seleccionado")
    }
})

module.exports = PrevEmailLibre