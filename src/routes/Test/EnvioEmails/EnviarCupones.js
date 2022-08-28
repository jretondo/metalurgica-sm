const express = require('express')
const EmailCupon = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../../Global/Colors.json')
const Links = require('../../../Global/Links.json')
const Names = require('../../../Global/Names.json')
const NumberFormat = require("../../../lib/Funciones/NumberFormat")
const SendEmail = require("../../../lib/Emails/SendEmail")

EmailCupon.post('/test/EmailCupon', async (req, res) => {
    const token = req.headers["x-access-token"]
    const query = Consultador()
    const prevText = req.body.prevText
    const cupon = req.body.cupon
    const asunto = req.body.asunto
    const listaEmails = req.body.listaEmails
    const isSecure = await SecureVerify(token)
    const sql1 = ` SELECT * FROM cupones_tb WHERE cupon = ? `
    let result1
    let fallados = []
    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [cupon]
            })
        } finally {
            let cant
            try {
                cant = parseInt(result1.length)
            } catch (error) {
                cant = 0
            }
            if (cant > 0) {
                let txtFoother
                const tipo = parseInt(result1[0].desc_tipo)
                const porcentaje = parseInt(result1[0].porc)
                const montoDesc = NumberFormat(result1[0].monto_dec)
                const descMax = NumberFormat(result1[0].desc_max)
                const montoMin = NumberFormat(result1[0].monto_min)

                if (tipo === 0) {
                    txtFoother = `
                    <span> * El descuento es por $${montoDesc}. El mìnimo de compra para útilizar el cupón es de $${montoMin}</span>
                    `
                } else {
                    txtFoother = `
                    <span> * El descuento es por el ${porcentaje}% de la compra. El mìnimo de compra para útilizar el cupón es de $${montoMin} y el tope de descuento es de $${descMax}</span>
                    `
                }

                const parrafosHead = [
                    prevText
                ]

                const datos2 = {
                    Colors,
                    Links,
                    Names,
                    //Particular
                    //Head
                    titlePage: "Nuevo Cupón",
                    titleHead: "Buenos días!",
                    parrafosHead: parrafosHead,

                    //ActionBtn
                    titleButton: "A continuación le pasamos un cupón de descuento para que útilice en nuestra web:",
                    textCall: cupon,
                    textFoother: `Ingrese el cupón en la sección de carrito de compra en nuestra web: <br> <a href='https://cordobabaitcast.com.ar/cart' target='_blank'>Córdoba Baitcast Web - Carrito de compra</a>
                    <br />
                    <br />
                    ${txtFoother}
                    `
                }

                await ejs.renderFile(path.join("views", "Emails", "Templates", "ForgotPass.ejs"), datos2, async function (err, data) {
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
                                    titlePage: "Envío de Cupones",
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
                    status: 500,
                    error: "No hay cupón seleccionado"
                }
                res.send(respuesta)
            }
        }
    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }

})

module.exports = EmailCupon