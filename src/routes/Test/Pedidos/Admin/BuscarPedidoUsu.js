const express = require('express')
const BuscarPedidoUsu = express()
const SecureVerify = require("../../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../../database/Consultador")
const formatDate = require("../../../../lib/Funciones/FormatDate")
const formatMoney = require("../../../../lib/Funciones/NumberFormat")

BuscarPedidoUsu.post('/test/BuscarPedidoUsu', async (req, res) => {
    const token = req.headers["x-access-token"];
    const query = Consultador()
    const palabra = "%" + req.body.palabra + "%"
    const tipo = req.body.type
    let status
    if (tipo === "pend") {
        status = 1
    } else if (tipo === "end") {
        status = 3
    } else if (tipo === "env") {
        status = 2
    } else if (tipo === "canc") {
        status = 0
    } else {
        status = 0
        seguir = false
    }

    const sql1 = ` SELECT id, nombre, apellido FROM usuarios WHERE email_face LIKE ? OR nombre LIKE ? OR apellido LIKE ? ORDER BY nombre ASC `
    const sql2 = ` SELECT DISTINCT payment_type, merchant_order_id, provincia, ciudad, costo_envio, status, desc_cupon FROM products_delivered WHERE user_id = ? AND status = ? `
    const sql3 = ` SELECT date_payment, SUM(price) as total FROM products_delivered WHERE merchant_order_id = ? `

    let result1
    let result2
    let result3

    let resultado = []
    let respuesta = []
    const isSecure = await SecureVerify(token)

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [palabra, palabra, palabra]
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
                    const idUsu = item.id
                    const nombre = item.nombre
                    const apellido = item.apellido

                    try {
                        result2 = await query({
                            sql: sql2,
                            timeout: 2000,
                            values: [idUsu, status]
                        })
                    } finally {
                        let totalDescuento
                        try {
                            totalDescuento = parseFloat(result1[0].desc_cupon)
                        } catch (error) {
                            totalDescuento = 0
                        }
                        const cant2 = parseInt(result2.length)
                        if (cant2 > 0) {
                            result2.map(async (item2, key2) => {
                                try {
                                    const estado = item2.status
                                    const tipoPago = item2.payment_type
                                    const idOrden = item2.merchant_order_id
                                    const provincia = item2.provincia
                                    const ciudad = item2.ciudad
                                    const costoEnvio = parseFloat(item2.costo_envio)

                                    try {
                                        result3 = await query({
                                            sql: sql3,
                                            timeout: 2000,
                                            values: [idOrden]
                                        })
                                    } finally {
                                        const totalPrecio = result3[0].total
                                        const totaPrice = await formatMoney((totalPrecio + costoEnvio - totalDescuento), 2)
                                        const fechaPago = await formatDate(result3[0].date_payment, "dd/mm/yyyy")
                                        resultado.push({
                                            tipoPago,
                                            idOrden,
                                            fechaPago,
                                            provincia,
                                            ciudad,
                                            totaPrice,
                                            idUsu,
                                            nombre,
                                            apellido,
                                            estado
                                        })
                                    }
                                } catch (error) {
                                    return res2
                                }

                                if ((cant - 1) === key) {
                                    if ((cant2 - 1) === key2) {
                                        respuesta = {
                                            status: 200,
                                            result1: resultado
                                        }
                                        res.send(respuesta)
                                    }
                                }
                            })
                        } else {
                            if ((cant - 1) === key) {
                                respuesta = {
                                    status: 200,
                                    result1: resultado
                                }
                                res.send(respuesta)
                            }
                        }
                    }
                })
            } else {
                respuesta = {
                    status: 201,
                    result1: []
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

module.exports = BuscarPedidoUsu