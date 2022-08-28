const express = require('express')
const NuevoPedido = express()
const jwt = require("jsonwebtoken")
const Consultador = require("../../../../database/Consultador")
const CalculoDescCupon = require("../../../lib/Funciones/DescuentoCupon")

NuevoPedido.post('/test/NuevoPedido', async (req, res) => {
    const query = Consultador()
    const token = req.headers['x-access-token']
    const request = req.body
    const paymentId = request.paymentId
    const paymentType = request.paymentType
    const merchantOrderId = request.merchantOrdeId
    const cartItems = request.cartItems
    const adomi = request.adomi
    const codSuc = request.codSuc
    const cp = request.cp
    const provincia = request.provincia
    const ciudad = request.ciudad
    const direccion1 = request.direccion1
    const direccion2 = request.direccion2
    const codArea = request.codArea
    const telefono = request.telefono
    const infoAd = request.infoAd
    let costoEnvio = request.costoEnvio
    const nombre = request.nombre
    const apellido = request.apellido
    const casilla = request.casilla
    const cupon = request.cupon
    let totalDescuento = 0
    try {
        totalDescuento = await CalculoDescCupon(cartItems, cupon)
    } catch (error) {

    }


    if (ciudad === "CORDOBA") {
        costoEnvio = 0
    }

    let sql1
    const slq2 = `INSERT INTO products_delivered (product_name, quantity, price, status, payment_id, payment_type, merchant_order_id, user_id, domicilio, cod_suc_correo, cp, provincia, ciudad, direccion1, direccion2, cod_area, telefono, infoadd, costo_envio, nombre, apellido, casilla, x_prod, y_prod, z_prod, peso_prod, id_prod, tipo_var, variedad, es_var, costo_prod, cupon, desc_cupon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const sql5 = `UPDATE products_principal SET stock = (stock - ?) WHERE id = ?`
    const sql6 = `UPDATE productos_variedades SET stock = (stock - ?) WHERE id_prod = ? AND variedad = ? AND tipo = ?`
    const sql7 = `UPDATE usuarios SET nombre = ?, apellido = ?, email_face = ?, provincia = ?, ciudad = ?, direccion1 = ?, direccion2 = ?, cp = ?, cod_area = ?, telefono = ?, info_adicional = ? WHERE id = ?`
    const sql8 = ` UPDATE cupones_tb SET max_cant = (max_cant - 1) WHERE cupon = ? `

    let result1
    let result2
    let result5
    let result6
    let result7
    let result8

    let cant
    try {
        cant = parseInt(cartItems.length)
    } catch (error) {
        cant = 0
    }

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
            const cantItems = parseInt(cartItems.length)

            try {
                result7 = await query({
                    sql: sql7,
                    timeout: 2000,
                    values: [nombre, apellido, casilla, provincia, ciudad, direccion1, direccion2, cp, codArea, telefono, infoAd, idUsu]
                })
            } finally {

            }

            cartItems.map(async (item, key) => {
                const idProd = item.id
                const producto = item.name
                const precio = Number(item.price)
                const descuento = Number(item.discount)
                const cantidad = Number(item.quantity)
                const finalPrice = precio - descuento
                const tipo = item.selectedProductColor
                const variedad = item.selectedProductSize
                const xProd = item.sizeX
                const yProd = item.sizeY
                const zProd = item.sizeZ
                const peso = item.peso
                const costoProd = item.costoProd
                let esVar = 0

                if (tipo !== null && tipo !== "" && tipo !== "null" && tipo !== undefined) {
                    esVar = 0
                    try {
                        result6 = await query({
                            sql: sql6,
                            timeout: 2000,
                            values: [cantidad, idProd, variedad, tipo]
                        })
                    } finally {

                    }
                } else {
                    esVar = 1

                    try {
                        result5 = await query({
                            sql: sql5,
                            timeout: 2000,
                            values: [cantidad, idProd]
                        })
                    } finally {

                    }
                }

                try {
                    result2 = await query({
                        sql: slq2,
                        timeout: 2000,
                        values: [producto, cantidad, finalPrice, 1, paymentId, paymentType, merchantOrderId, idUsu, adomi, codSuc, cp, provincia, ciudad, direccion1, direccion2, codArea, telefono, infoAd, costoEnvio, nombre, apellido, casilla, xProd, yProd, zProd, peso, idProd, tipo, variedad, esVar, costoProd, cupon, totalDescuento]
                    })
                } finally {
                    if (parseInt(cantItems - 1) === key) {
                        respuesta = {
                            status: 200,
                            result: "Pedido cargado con éxito!"
                        }
                        res.json(respuesta)
                    }
                }
            })
        }
    }

})

module.exports = NuevoPedido