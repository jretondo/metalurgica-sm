const express = require('express')
const FacturacionWS = express()
const CrearFActura = require("../../../lib/Funciones/CrearFactura")
const CrearFactPDF = require("../../../lib/Funciones/CrearFactPDF")
const DatosFact = require("../../../Global/FactData.json")
const FormatDate = require("../../../lib/Funciones/FormatDate")
const zfill = require("../../../lib/Funciones/CeroIzq")
const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")
const Consultador = require("../../../../database/Consultador")
const formatMoney = require("../../../lib/Funciones/NumberFormat")
const Entorno = require("../Global/Entorno.json")
const CalculoDescCupon = require("../../../lib/Funciones/DescuentoCupon")

FacturacionWS.post('/test/CrearFactura', async (req, res) => {
    const query = Consultador()
    const token = req.headers['x-access-token']
    const request = req.body
    const itemsCart = request.itemsCart
    const clienteName = request.clienteName
    const clienteNro = request.clienteNro
    const clienteDireccion = request.clienteDireccion
    const clienteEmail = request.clienteEmail
    const orderId = request.orderId
    const costoEnvio = request.costoEnvio
    const cupon = request.cupon
    let totalDescuento = 0
    try {
        totalDescuento = await CalculoDescCupon(itemsCart, cupon)
    } catch (error) {

    }

    let listaItems = []
    let subTotal = 0
    let sql1
    const sql2 = `INSERT INTO facturas (merchant_order_id, fecha, t_cbte, pv, nro, sub_total, iva, total, cae, vto_cae, cliente_id, cliente_name, cliente_dni, cliente_email, cliente_direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    let result1
    let result2

    const cantItems = parseInt(itemsCart.length)

    if (cantItems > 0) {

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
                await itemsCart.map(async (item, key) => {
                    const id = parseInt(key) + 1
                    const name = item.name
                    const priceIni = Number(item.price)
                    const discount = Number(item.discount)
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
                    style: fs.readFileSync(path.join(__dirname, './style.css'), 'utf8')
                };

                const totalFact = subTotal + costoEnvio - totalDescuento
                const totalFactStr = formatMoney(totalFact)
                const subTotalStr = formatMoney(subTotal)
                const costoEnvioStr = formatMoney(costoEnvio)
                const totalDescStr = formatMoney(totalDescuento)

                let facturar
                if (Entorno.entorno === true) {
                    facturar = 1
                } else {
                    facturar = totalFact
                }

                const facturaData = await CrearFActura(clienteNro, facturar, false, 0)

                if (!facturaData) {
                    respuesta = {
                        status: 501,
                        error: "Error interno en el servidor!"
                    }
                    res.send(respuesta)
                } else {
                    const factData = {
                        "ver": 1,
                        "fecha": facturaData.date,
                        "cuit": 20185999336,
                        "ptoVta": 3,
                        "tipoCmp": 11,
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
                            timeout: 5000,
                            values: [orderId, facturaData.date, 11, 3, facturaData.cbte, totalFact, 0, totalFact, facturaData.nroCae, facturaData.vtoCae, idUsu, clienteName, clienteNro, clienteEmail, clienteDireccion]
                        })
                    } finally {

                        await CrearFactPDF(myCss, factData, DatosFact[0].logo, DatosFact[0].logoAfip1, DatosFact[0].logoAfip2, FormatDate(new Date(facturaData.date), "dd/mm/yyyy"), clienteName, clienteNro, clienteDireccion, clienteEmail, subTotalStr, costoEnvioStr, totalFactStr, facturaData.nroCae, FormatDate(new Date(facturaData.vtoCae), "dd/mm/yyyy"), listaItems, "00003", await zfill(facturaData.cbte, 8), res, facturaData, false, 0, totalDescuento, totalDescStr)
                    }
                }
            }
        }

    } else {
        respuesta = {
            status: 301,
            error: "No hay datos del carrito de compras!"
        }
    }

})

module.exports = FacturacionWS