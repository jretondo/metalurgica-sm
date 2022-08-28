const express = require('express')
const PrevEmailMkt = express()
const SecureVerify = require("../../../../lib/Funciones/SecureVerify")
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../../../Global/Colors.json')
const Links = require('../../../../Global/Links.json')
const Names = require('../../../../Global/Names.json')

PrevEmailMkt.post('/test/PrevEmailMkt', async (req, res) => {
    const token = req.headers["x-access-token"]
    const prevText = req.body.prevText
    const titulo = req.body.titulo
    const productos = req.body.productos
    const isSecure = await SecureVerify(token)
    //const url = "http://192.168.0.11:3001"
    const url = "https://cordobabaitcast.com.ar"
    let productsList = []

    if (isSecure) {

        for (let i = 0; i < productos.length; i = i + 2) {
            productsList.push({
                image1: productos[i].image[0],
                link1: url + "/product/" + productos[i].id,
                text1: productos[i].name,
                image2: productos[i + 1].image[0],
                link2: url + "/product/" + productos[i + 1].id,
                text2: productos[i + 1].name
            })
        }

        const parrafosHead = [prevText]

        const datos2 = {
            Colors,
            Links,
            Names,
            //Particular
            //Head
            titlePage: "Productos",
            titleHead: titulo,
            parrafosHead: parrafosHead,

            //Products
            productsList: productsList
        }

        ejs.renderFile(path.join("views", "registrado.ejs"), function (err, data) {
            res.render('Emails/Templates/EmailMarketing.ejs', datos2)
        });
    } else {
        res.send("Error en el formato o no hay cupñon seleccionado")
    }
})

module.exports = PrevEmailMkt