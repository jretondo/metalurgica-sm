const express = require('express')
const ConfirmEnvio = express()
const SecureVerify = require("../../../../lib/Funciones/SecureVerify")
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../../../Global/Colors.json')
const Links = require('../../../../Global/Links.json')
const Names = require('../../../../Global/Names.json')
const Consultador = require("../../../../../database/Consultador")
const SendEmail = require('../../../../lib/Emails/SendEmail');
const formateDate = require("../../../../lib/Funciones/FormatDate")

ConfirmEnvio.post('/test/ConfirmEnvio', async (req, res) => {
    const token = req.headers["x-access-token"];
    const query = Consultador()
    const request = req.body
    const idOrder = request.idOrder
    const codSeguimiento = request.codSeguimiento
    const fecha = formateDate(new Date(), "yyyy-mm-dd hor:min:seg")
    const sql1 = ` UPDATE products_delivered SET status = ?, cod_correo_ar = ?, date_delireved = ? WHERE merchant_order_id = ? `
    const sql2 = ` SELECT * FROM products_delivered WHERE merchant_order_id = ? ORDER BY id LIMIT 1 `
    let result1
    let result2

    let respuesta = []
    const isSecure = await SecureVerify(token)

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [2, codSeguimiento, fecha, idOrder]
            })
        } finally {
            let affectedRows
            try {
                affectedRows = parseInt(result1.affectedRows)
            } catch (error) {
                affectedRows = 0
            }

            if (affectedRows > 0) {

                try {
                    result2 = await query({
                        sql: sql2,
                        timeout: 2000,
                        values: [idOrder]
                    })
                } finally {
                    const nombre = result2[0].nombre
                    const apellido = result2[0].apellido
                    const email = result2[0].casilla

                    const parrafosHead = [
                        "Acabamos de envíar tu pedido!"
                    ]

                    const datos2 = {
                        Colors,
                        Links,
                        Names,
                        //Particular
                        //Head
                        titlePage: "Pedido Enviado",
                        titleHead: "Hola" + " " + nombre + " " + apellido,
                        parrafosHead: parrafosHead,

                        //ActionBtn
                        titleButton: "A continuación le pasamos el código de seguimiento de Correo Argentino",
                        textCall: codSeguimiento,
                        textFoother: "Ingrese su código en la siguiente página de Correo Argentino: <br> <a href='https://www.correoargentino.com.ar/formularios/e-commerce' target='_blank'>Correo Argentino - Seguimiento de paqueteria e-commerce</a>"
                    }

                    await ejs.renderFile(path.join("views", "Emails", "Templates", "ForgotPass.ejs"), datos2, async function (err, data) {
                        if (err) {
                            respuesta = {
                                status: 401,
                                error: "Email no envíado!"
                            }
                            res.send(respuesta);
                        } else {
                            await SendEmail("info@cordobabaitcast.com.ar", "Córdoba Baitcast <info@cordobabaitcast.com.ar>", email, "Pedido envíado por Correo Argentino", data)
                            respuesta = {
                                status: 200,
                                error: "Email envíado con éxito!"
                            }
                            res.send(respuesta);
                        }
                    });
                }
            } else {
                respuesta = {
                    status: 501,
                    error: "No se modificó el estado!"
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

module.exports = ConfirmEnvio