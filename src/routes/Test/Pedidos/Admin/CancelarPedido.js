const express = require('express')
const CancelarPedidoAdmin = express()
const Consultador = require("../../../../../database/Consultador")
const formatDate = require("../../../../lib/Funciones/FormatDate")
const mercadopago = require("mercadopago")
const SecureVerify = require("../../../../lib/Funciones/SecureVerify")

CancelarPedidoAdmin.post('/test/CancelarPedidoAdmin', async (req, res) => {
    mercadopago.configurations.setAccessToken("APP_USR-5475928734302525-040812-b6dfa99f86cfae784d17fb09033cf4b9-500119393");
    const query = Consultador()
    const token = req.headers['x-access-token']
    const request = req.body
    const orderId = request.orderId
    const sql1 = `SELECT DISTINCT payment_id, nombre, apellido, casilla FROM products_delivered WHERE merchant_order_id = ? AND status = 1 `
    const sql2 = `UPDATE products_delivered SET status = 0, date_cancelado = ? WHERE payment_id = ? `

    let result1 = []
    let result2 = []

    let respuesta = []

    const isSecure = await SecureVerify(token)

    if (isSecure) {

        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [orderId]
            })
        } finally {
            let cant
            try {
                cant = parseInt(result1.length)
            } catch (error) {
                cant = 0
            }
            if (cant > 0) {
                result1.map(async (item, key) => {

                    const paymentId = item.payment_id
                    mercadopago.payment.refund(paymentId)
                        .then(async (response) => {
                            const fechaCancelado = await formatDate(new Date(), "yyyy-mm-dd")

                            try {
                                result2 = await query({
                                    sql: sql2,
                                    timeout: 2000,
                                    values: [fechaCancelado, paymentId]
                                })
                            } finally {
                                if (key === cant - 1) {
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
            } else {
                respuesta = {
                    status: 401,
                    error: "No hay pedidos pendientes con ese número!"
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

module.exports = CancelarPedidoAdmin