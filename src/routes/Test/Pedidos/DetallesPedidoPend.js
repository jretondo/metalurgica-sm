const express = require('express')
const DetPendPendiente = express()
const Consultador = require("../../../../database/Consultador")
const formatMoney = require('../../../lib/Funciones/NumberFormat')
const jwt = require("jsonwebtoken")

DetPendPendiente.post('/test/DetPedidoPend', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const orderId = request.orderId
    const token = req.headers['x-access-token']
    let sql1
    const sql2 = `SELECT * FROM products_delivered WHERE user_id = ? AND merchant_order_id = ?`
    const sql3 = `SELECT * FROM correo_sucursales WHERE cod_suc = ?`
    let result1
    let result2
    let result3

    let resultado = []
    let lista = []
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
                    values: [idUsu, orderId]
                })
            } finally {
                const cant = parseInt(result2.length)

                if (cant > 0) {
                    const aDomi = result2[0].domicilio
                    const codSucursal = result2[0].cod_suc_correo
                    const codPost = result2[0].cp
                    const provincia = result2[0].provincia
                    const ciudad = result2[0].ciudad
                    const direccion1 = result2[0].direccion1
                    const direccion2 = result2[0].direccion2
                    const codArea = result2[0].cod_area
                    const telefono = result2[0].telefono
                    const infoAdd = result2[0].infoAdd
                    const costoEnvio = formatMoney(result2[0].costo_envio)
                    const nombre = result2[0].nombre
                    const apellido = result2[0].apellido
                    const casillaEmail = result2[0].casillo
                    const codCoreeo = result2[0].cod_correo_ar
                    let total = 0
                    let montoDesc = parseFloat(result2[0].desc_cupon)
                    if (isNaN(montoDesc)) {
                        montoDesc = 0
                    }

                    const cuponName = result2[0].cupon

                    let sucursalCorreo = ""

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
                                total = total + parseFloat(result2[0].costo_envio) - parseFloat(montoDesc)
                                total = formatMoney(total)

                                const descuentoStr = formatMoney(montoDesc)
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
                                    cuponName,
                                    descuentoStr,
                                    montoDesc
                                })

                                respuesta = {
                                    status: 200,
                                    result: resultado
                                }
                                res.json(respuesta)
                            }
                        })
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
        }
    }
})

module.exports = DetPendPendiente