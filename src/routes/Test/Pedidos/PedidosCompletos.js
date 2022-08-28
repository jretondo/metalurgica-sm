const express = require('express')
const PedidosCompletos = express()
const jwt = require("jsonwebtoken")
const Consultador = require("../../../../database/Consultador")
const formatDate = require("../../../lib/Funciones/FormatDate")
const moneyFormat = require("../../../lib/Funciones/NumberFormat")

PedidosCompletos.get('/test/PedidosCompletos', async (req, res) => {
    const query = Consultador()
    const token = req.headers['x-access-token']
    let sql1
    const sql2 = `SELECT DISTINCT merchant_order_id, costo_envio, status, payment_id, desc_cupon FROM products_delivered WHERE user_id = ? AND (status = 3 OR status = 0) ORDER BY merchant_order_id DESC LIMIT 10`
    const sql3 = `SELECT date_payment, SUM(price) as suma FROM products_delivered WHERE merchant_order_id = ? LIMIT 1`
    let result1
    let result2
    let result3
    let resultado = []
    let respuesta = []

    if (!token) {
        respuesta = {
            status: 401,
            result: "",
            error: "No tiene los permisos para esta operación"
        }
        res.json(respuesta)
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
            res.json(respuesta)
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
                        values: [idUsu]
                    })
                } finally {

                    const cantidad = parseInt(result2.length)
                    if (cantidad > 0) {
                        result2.map(async (item, key) => {
                            const orderId = item.merchant_order_id
                            const costoEnvio = parseFloat(item.costo_envio)
                            const status = parseInt(item.status)
                            const paymentId = item.payment_id
                            let montoDesc = parseFloat(item.desc_cupon)
                            if (isNaN(montoDesc)) {
                                montoDesc = 0
                            }

                            let statuStr

                            if (status === 1) {
                                statuStr = "Pendiente de envío"
                            } else if (status === 2) {
                                statuStr = "Envíado a Correo Argentino"
                            } else if (status === 0) {
                                statuStr = "Pedido Cancelado"
                            }

                            try {
                                result3 = await query({
                                    sql: sql3,
                                    timeout: 2000,
                                    values: [orderId]
                                })
                            } finally {
                                const costoProductos = parseFloat(result3[0].suma)
                                const total = moneyFormat(parseFloat(costoProductos + costoEnvio - montoDesc))
                                const date = formatDate(result3[0].date_payment, "dd/mm/yyyy")
                                resultado.push({
                                    orderId,
                                    date,
                                    statuStr,
                                    status,
                                    total,
                                    paymentId
                                })

                                if ((cantidad - 1) === key) {
                                    respuesta = {
                                        status: 200,
                                        result: resultado
                                    }
                                    res.json(respuesta)
                                }
                            }
                        })
                    } else {
                        respuesta = {
                            status: 200,
                            result: []
                        }
                        res.json(respuesta)
                    }

                }
            }
        }
    }
})

module.exports = PedidosCompletos