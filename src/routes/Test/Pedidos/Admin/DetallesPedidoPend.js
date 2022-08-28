const express = require('express')
const DetPendPendienteAdm = express()
const Consultador = require("../../../../../database/Consultador")
const formatMoney = require('../../../../lib/Funciones/NumberFormat')
const SecureVerify = require("../../../../lib/Funciones/SecureVerify")

DetPendPendienteAdm.post('/test/DetPedidoPendAdmin', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const orderId = request.orderId
    const token = req.headers['x-access-token']
    const sql2 = `SELECT * FROM products_delivered WHERE  merchant_order_id = ?`
    const sql3 = `SELECT * FROM correo_sucursales WHERE cod_suc = ?`
    const sql4 = ` SELECT SUM(peso_prod) as pesoTotal, SUM(costo_prod) as costosTotal FROM products_delivered WHERE merchant_order_id = ? `
    let result2
    let result3
    let result4

    let resultado = []
    let lista = []
    let respuesta = []

    const isSecure = await SecureVerify(token)

    if (isSecure) {
        try {
            result2 = await query({
                sql: sql2,
                timeout: 2000,
                values: [orderId]
            })
        } finally {
            const cant = parseInt(result2.length)

            if (cant > 0) {
                let pesoTotal
                let costosTotal
                const aDomi = result2[0].domicilio
                const codSucursal = result2[0].cod_suc_correo
                const codPost = result2[0].cp
                const provincia = result2[0].provincia
                const ciudad = result2[0].ciudad
                const direccion1 = result2[0].direccion1
                const direccion2 = result2[0].direccion2
                const codArea = result2[0].cod_area
                const telefono = result2[0].telefono
                const infoAdd = result2[0].infoadd
                const costoEnvio = formatMoney(result2[0].costo_envio)
                const costoEnvioNum = parseFloat(result2[0].costo_envio)
                const nombre = result2[0].nombre
                const apellido = result2[0].apellido
                const casillaEmail = result2[0].casilla
                const codCoreeo = result2[0].cod_correo_ar
                const cupoName = result2[0].cupon
                let totalDescuento
                try {
                    totalDescuento = parseFloat(result2[0].desc_cupon)
                } catch (error) {
                    totalDescuento = 0
                }
                let total = 0

                let sucursalCorreo = ""

                try {
                    result4 = await query({
                        sql: sql4,
                        timeout: 2000,
                        values: [orderId]
                    })
                } finally {

                    try {
                        pesoTotal = formatMoney(result4[0].pesoTotal, 0)
                        costosTotal = formatMoney(result4[0].costosTotal, 0)

                    } catch (error) {
                        pesoTotal = formatMoney(0, 0)
                        costosTotal = formatMoney(0, 0)
                    }

                    try {
                        result3 = await query({
                            sql: sql3,
                            timeout: 3000,
                            values: [codSucursal]
                        })
                    } finally {
                        if (parseInt(result3.length) > 0) {
                            const provSuc = result3[0].provincia
                            const localSuc = result3[0].localidad
                            const cpSuc = result3[0].cp
                            const calleSuc = result3[0].calle
                            const altSuc = result3[0].alt

                            sucursalCorreo = calleSuc + " " + altSuc + ", " + localSuc + ", " + provSuc + " (CP " + cpSuc + ")"
                        }

                        result2.map((item, key) => {
                            const idProd = item.id
                            const productName = item.product_name
                            const cantProd = item.quantity
                            const price = formatMoney(item.price)
                            const tipo = item.tipo_var
                            const variedad = item.variedad
                            const esVar = item.es_var
                            const statusEnv = parseInt(item.status)

                            total = total + parseFloat(item.price)
                            lista.push({
                                idProd,
                                productName,
                                cantProd,
                                price,
                                tipo,
                                variedad,
                                esVar
                            })
                            if ((cant - 1) === key) {
                                const totalProd = formatMoney(total)
                                total = total + parseFloat(result2[0].costo_envio) - totalDescuento
                                total = formatMoney(total)
                                totalDescuento = formatMoney(totalDescuento)
                                resultado.push({
                                    aDomi,
                                    sucursalCorreo,
                                    codPost,
                                    provincia,
                                    ciudad,
                                    direccion1,
                                    direccion2,
                                    codArea,
                                    telefono,
                                    infoAdd,
                                    costoEnvio,
                                    nombre,
                                    apellido,
                                    casillaEmail,
                                    total,
                                    lista,
                                    statusEnv,
                                    codCoreeo,
                                    pesoTotal,
                                    totalProd,
                                    costosTotal,
                                    totalDescuento,
                                    cupoName
                                })

                                respuesta = {
                                    status: 200,
                                    result: resultado
                                }
                                res.json(respuesta)
                            }
                        })
                    }
                }
            } else {
                respuesta = {
                    status: 401,
                    result: "",
                    error: "No tiene los permisos para esta operación"
                }
                res.json(respuesta)
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

module.exports = DetPendPendienteAdm