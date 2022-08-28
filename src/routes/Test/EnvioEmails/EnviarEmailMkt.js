const express = require('express')
const EnviarEmaiMkt = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../../Global/Colors.json')
const Links = require('../../../Global/Links.json')
const Names = require('../../../Global/Names.json')
const SendEmail = require("../../../lib/Emails/SendEmail")

EnviarEmaiMkt.post('/test/EnviarEmaiMkt', async (req, res) => {
    const token = req.headers["x-access-token"]
    const prevText = req.body.prevText
    const titulo = req.body.titulo
    const productos = req.body.productos
    const listaEmails = req.body.listaEmails
    const asunto = req.body.asunto
    const isSecure = await SecureVerify(token)
    //const url = "http://192.168.0.11:3001"
    const url = "https://cordobabaitcast.com.ar"
    let productsList = []
    let fallados = []
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

        await ejs.renderFile(path.join("views", "Emails", "Templates", "EmailMarketing.ejs"), datos2, async function (err, data) {
            if (err) {
                respuesta = {
                    status: 401,
                    error: err
                }
                res.send(respuesta);
            } else {
                const cantEmails = parseInt(listaEmails.length)
                listaEmails.map(async (emailDest, key) => {
                    await SendEmail(process.env.SENDER_EMAIL_CONF_INFO, process.env.SENDER_EMAIL_INFO, emailDest.email, asunto, data)
                        .then(res => {
                        })
                        .catch(err => {
                            fallados.push(emailDest.email)
                        })

                    if (parseInt(cantEmails - 1) === key) {
                        let fallados2
                        try {
                            fallados2 = await fallados.map(email => {
                                return (
                                    `<h4>${email}</h4>`
                                )
                            })
                        } catch (error) {
                            fallados2 = "Ninguno"
                        }

                        if (fallados.length === 0) {
                            fallados2 = "Ninguno"
                        }

                        const datos3 = {
                            Colors,
                            Links,
                            Names,
                            //Particular
                            //Head
                            titlePage: "Envío de emails",
                            titleHead: "Hola Marcelo!",
                            parrafosHead: ["Este emails es para confirmarle que ya se han envíado todos los emails"],

                            //ActionBtn
                            titleButton: "A continuación le pasamos todas las emails que fallaron el envío:",
                            textCall: fallados2,
                            textFoother: `Cualquier duda hable con soporte de NekoNET`
                        }

                        await ejs.renderFile(path.join("views", "Emails", "Templates", "ForgotPass.ejs"), datos3, async function (err, data2) {
                            await SendEmail(process.env.SENDER_EMAIL_CONF_INFO, process.env.SENDER_EMAIL_INFO, "info@cordobabaitcast.com.ar", asunto, data2)
                        })
                    }
                })
                respuesta = {
                    status: 200,
                    result: "Email envíado con éxito!"
                }
                res.send(respuesta);
            }
        })

    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }

})

module.exports = EnviarEmaiMkt