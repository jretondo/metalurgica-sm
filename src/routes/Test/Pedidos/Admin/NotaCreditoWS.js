const express = require('express')
const CrearNotaCred = express()
const CrearFActura = require("../../../../lib/Funciones/CrearFactura")
const CrearFactPDF = require("../../../../lib/Funciones/CrearFactPDF")
const DatosFact = require("../../../../Global/FactData.json")
const FormatDate = require("../../../../lib/Funciones/FormatDate")
const zfill = require("../../../../lib/Funciones/CeroIzq")
const fs = require("fs")
const path = require("path")
const Consultador = require("../../../../../database/Consultador")
const formatMoney = require("../../../../lib/Funciones/NumberFormat")
const Entorno = require("../../Global/Entorno.json")
const SecureVerify = require("../../../../lib/Funciones/SecureVerify")

CrearNotaCred.post('/test/CrearNotaCredAdmin', async (req, res) => {
    const query = Consultador()
    const token = req.headers['x-access-token']
    const request = req.body
    const orderId = request.orderId
    let listaItems = []
    let subTotal = 0

    const sql2 = `INSERT INTO facturas (merchant_order_id, fecha, t_cbte, pv, nro, sub_total, iva, total, cae, vto_cae, cliente_id, cliente_name, cliente_dni, cliente_email, cliente_direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const sql3 = `SELECT * FROM facturas WHERE merchant_order_id = ?`
    const sql4 = `SELECT * FROM products_delivered WHERE merchant_order_id = ?`

    let result1
    let result2
    let result3
    let result4

    const isSecure = await SecureVerify(token)

    if (isSecure) {
        try {
            result4 = await query({
                sql: sql4,
                timeout: 2000,
                values: [orderId]
            })
        } finally {
            console.log(`result4`, result4)
            const cantidadItems = parseInt(result4.length)
            const idUsu = parseInt(result4[0].user_id)
            if (cantidadItems > 0) {
                const costoEnvio = result4[0].costo_envio

                await result4.map(async (item, key) => {
                    const id = parseInt(key) + 1
                    const name = item.product_name
                    const priceIni = Number(item.price)
                    const discount = 0
                    const cant = Number(item.quantity)
                    const priceDB = priceIni - discount
                    const totalDb = priceDB * cant

                    subTotal = subTotal + totalDb

                    const price = await formatMoney(priceDB)
                    const total = await formatMoney(totalDb)

                    const product = {
                        id,
                        name,
                        price,
                        cant,
                        total
                    }

                    listaItems.push(product)
                })

                const myCss = {
                    style: fs.readFileSync(path.join(__dirname, './assets/style.css'), 'utf8')
                };

                try {
                    result3 = await query({
                        sql: sql3,
                        timeout: 2000,
                        values: [orderId]
                    })
                } finally {
                    let cantFact
                    try {
                        cantFact = parseInt(result3.length)
                    } catch (error) {
                        cantFact = 0
                    }

                    if (cantFact > 0) {

                        const totalFact = subTotal + costoEnvio
                        const totalFactStr = formatMoney(totalFact)
                        const subTotalStr = formatMoney(subTotal)
                        const costoEnvioStr = formatMoney(costoEnvio)

                        const clienteNro = result3[0].cliente_dni
                        const clienteName = result3[0].cliente_name
                        const clienteEmail = result3[0].cliente_email
                        const clienteDireccion = result3[0].cliente_direccion
                        const comprobanteRel = result3[0].nro

                        let facturar
                        if (Entorno.entorno === true) {
                            facturar = 1
                        } else {
                            facturar = totalFact
                        }

                        const facturaData = await CrearFActura(clienteNro, facturar, true, comprobanteRel)

                        const factData = {
                            "ver": 1,
                            "fecha": facturaData.date,
                            "cuit": 20185999336,
                            "ptoVta": 3,
                            "tipoCmp": 13,
                            "nroCmp": facturaData.cbte,
                            "importe": facturar,
                            "moneda": "PES",
                            "ctz": 0,
                            "tipoDocRec": 96,
                            "nroDocRec": clienteNro,
                            "tipoCodAut": "E",
                            "codAut": facturaData.nroCae
                        }

                        try {
                            result2 = await query({
                                sql: sql2,
                                timeout: 2000,
                                values: [orderId, facturaData.date, 13, 3, facturaData.cbte, totalFact, 0, totalFact, facturaData.nroCae, facturaData.vtoCae, idUsu, clienteName, clienteNro, clienteEmail, clienteDireccion]
                            })
                        } finally {
                            const comprobanteRelStr = "00003-" + await zfill(comprobanteRel, 8)

                            await CrearFactPDF(myCss, factData, DatosFact[0].logo, DatosFact[0].logoAfip1, DatosFact[0].logoAfip2, FormatDate(new Date(facturaData.date), "dd/mm/yyyy"), clienteName, clienteNro, clienteDireccion, clienteEmail, subTotalStr, costoEnvioStr, totalFactStr, facturaData.nroCae, FormatDate(new Date(facturaData.vtoCae), "dd/mm/yyyy"), listaItems, "00003", await zfill(facturaData.cbte, 8), res, facturaData, true, comprobanteRelStr)
                        }
                    } else {
                        respuesta = {
                            status: 501,
                            error: "No hay facturas generadas!"
                        }
                        res.send(respuesta)
                    }
                }

            } else {
                respuesta = {
                    status: 301,
                    error: "No hay datos del carrito de compras!"
                }

                res.send(respuesta);
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

module.exports = CrearNotaCred