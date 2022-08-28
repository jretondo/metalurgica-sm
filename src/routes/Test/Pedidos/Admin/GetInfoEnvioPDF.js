const express = require('express')
const GetInfoEmailPDF = express()
const Consultador = require("../../../../../database/Consultador")
const zfill = require("../../../../lib/Funciones/CeroIzq")

GetInfoEmailPDF.post('/test/GetInfoEmailPDF', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const orderId = request.orderId
    const notaCredito = request.notaCred
    let tcbte

    let resultado = []
    let respuesta = []

    if (notaCredito) {
        tcbte = 13
    } else {
        tcbte = 11
    }

    const sql1 = ` SELECT facturas.t_cbte, facturas.pv, facturas.nro, facturas.cliente_name, facturas.cliente_dni, facturas.cliente_email, facturas.merchant_order_id, products_delivered.cod_suc_correo, products_delivered.telefono, products_delivered.domicilio, products_delivered.merchant_order_id, products_delivered.ciudad, products_delivered.provincia, products_delivered.direccion1
    FROM facturas
    INNER JOIN products_delivered ON facturas.merchant_order_id=products_delivered.merchant_order_id WHERE facturas.merchant_order_id = ? AND facturas.t_cbte = ? `

    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [orderId, tcbte]
        })
    } finally {
        let cant
        try {
            cant = parseInt(result1.length)
        } catch (error) {
            cant = 0
        }

        if (cant > 0) {
            console.log(`result1[0]`, result1[0])
            const dni = result1[0].cliente_dni
            const nombreCompleto = result1[0].cliente_name
            const aDomi2 = parseInt(result1[0].domicilio)
            const codCorreo = result1[0].cod_suc_correo
            const domicilio = result1[0].direccion1
            const provincia = result1[0].provincia
            const ciudad = result1[0].ciudad
            const email = result1[0].cliente_email
            const telefono = result1[0].telefono
            const pv = await zfill(result1[0].pv, 5)
            const nro = await zfill(result1[0].nro, 8)
            let aDomi
            if (aDomi2 === 1) {
                aDomi = true
            } else {
                aDomi = false
            }
            let facturaName
            if (notaCredito) {
                facturaName = "NC" + " " + pv + "-" + nro + ".pdf"
            } else {
                facturaName = "C" + " " + pv + "-" + nro + ".pdf"
            }

            resultado = {
                dni,
                nombreCompleto,
                aDomi,
                codCorreo,
                domicilio,
                provincia,
                ciudad,
                email,
                telefono,
                facturaName,
                notaCredito
            }

            respuesta = {
                status: 200,
                result: resultado
            }
            res.send(respuesta)
        } else {
            respuesta = {
                status: 201,
                result: []
            }
            res.send(respuesta)
        }
    }

})

module.exports = GetInfoEmailPDF
