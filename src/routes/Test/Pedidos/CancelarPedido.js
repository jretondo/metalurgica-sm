const express = require('express')
const CancelarPedido = express()
const jwt = require("jsonwebtoken")
const Consultador = require("../../../../database/Consultador")
const formatDate = require("../../../lib/Funciones/FormatDate")
const mercadopago = require("mercadopago")

CancelarPedido.post('/test/CancelarPedido', async (req, res) => {
    mercadopago.configurations.setAccessToken("APP_USR-5475928734302525-040812-b6dfa99f86cfae784d17fb09033cf4b9-500119393");
    const query = Consultador()
    const token = req.headers['x-access-token']
    const request = req.body
    const orderId = request.orderId
    let sql1
    const sql2 = `SELECT DISTINCT payment_id FROM products_delivered WHERE merchant_order_id = ? AND user_id = ? AND status = '1' `
    const sql3 = `UPDATE products_delivered SET status = '0', date_cancelado = ? WHERE payment_id = ? AND user_id = ? AND status = '1' `

    let result1 = []
    let result2 = []
    let result3 = []

    let respuesta = []

    if (!token) {
        respuesta = {
            status: 401,
            result: "",
            error: "No tiene los permisos para esta operación"
        }
        res.send(respuesta)
    } else {
        let decoded
        try {
            decoded = await jwt.verify(token, process.env.SECRET)
        } catch (error) {
            decoded = false
        }

        const facebook = decoded.facebook
        const valCons = decoded.ident

        if (!decoded) {
            respuesta = {
                status: 401,
                result: "",
                error: "No tiene los permisos para esta operación"
            }
            res.send(respuesta)
        } else {
            if (facebook) {
                sql1 = `SELECT id FROM usuarios WHERE facebook_id = ?`
            } else {
                sql1 = `SELECT id FROM usuarios WHERE email = ?`
            }

            try {
                result1 = await query({
                    sql: sql1,
                    timeout: 2000,
                    values: [valCons]
                })
            } finally {
                const idUsu = parseInt(result1[0].id)

                try {
                    result2 = await query({
                        sql: sql2,
                        timeout: 2000,
                        values: [orderId, idUsu]
                    })
                } finally {
                    const cant = parseInt(result2.length) - 1
                    result2.map(async (item, key) => {
                        const paymentId = item.payment_id
                        await mercadopago.payment.refund(paymentId)
                            .then(async (response) => {
                                const fechaCancelado = await formatDate(new Date(), "yyyy-mm-dd")

                                try {
                                    result3 = await query({
                                        sql: sql3,
                                        timeout: 2000,
                                        values: [fechaCancelado, paymentId, idUsu]
                                    })
                                } finally {
                                    if (key === cant) {
                                        respuesta = {
                                            status: 200,
                                            result: ""
                                        }
                                        res.send(respuesta)
                                    }
                                }
                            })
                            .catch(function (error) {
                                respuesta = {
                                    status: 401,
                                    result: "",
                                    error: error
                                }
                                res.send(respuesta)
                            });
                    })
                }
            }
        }
    }
})

module.exports = CancelarPedido