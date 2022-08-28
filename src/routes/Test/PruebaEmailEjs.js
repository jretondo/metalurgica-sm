const express = require('express')
const EmailPrueba = express()
const ejs = require("ejs");
const path = require('path');
const SendEmail = require("../../lib/Emails/SendEmail")

EmailPrueba.get('/emailp', (req, res) => {
    ejs.renderFile(path.join(__dirname, '..', '..', '..', "views", "registrado.ejs"), function (err, data) {
        let entorno
        const emailCliente = "jretondo@nekonet.com.ar"
        const token = "rewgeasgeageshewshrews"
        const saludo = "Buenas tardes"
        if (process.env.ENTORNO === "WINDOWS") {
            entorno = "http://192.168.0.11:3006"
        } else {
            entorno = "https://cordobabaitcast.com.ar"
        }
        res.render('pruebasEmail/Templates/ConfirmEmail', {
            title: 'Confirmación de correo',
            titleHeader: "Bienvenido a Córdoba Baitcast",
            imgLogo: process.env.LOGOS_URL + "/logo3.png",
            imgLogoSm: process.env.LOGOS_URL + "/logo_chico.png",
            linkPage: process.env.HOST,
            linkPage2: process.env.HOST_MASK,
            ayudaEmail: process.env.AYUDA_EMAIL_BAITCAST,
            linkUnuscribe: entorno + "/test/unsuscribe/" + emailCliente,
            name: "Retondo Javier",
            text: "El equipo de Córdoba Baitcast te da la bienvenidad a la mejor comunidad de pesca en Argentina.",
            linkConfirm: entorno + "/test/confirmemail/" + token,
            saludo: saludo,
            linkLegales: process.env.LINK_LEGALES
        });
    });
})

module.exports = EmailPrueba