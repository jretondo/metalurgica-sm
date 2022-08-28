const express = require('express')
const AplicarCupon = express()
const Consultador = require("../../../../database/Consultador")
const formatDate = require("../../../lib/Funciones/FormatDate")

AplicarCupon.get('/test/aplicarCupon/:cupon', async (req, res) => {
    const query = Consultador()
    const cupon = req.params.cupon
    const ahora = formatDate(new Date(), "yyyy-mm-dd hor:min:seg")
    const sql1 = ` SELECT * FROM cupones_tb WHERE cupon = ? AND vto_cupon > ? `
    let result1
    let resultado = []
    let respuesta = []

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [cupon, ahora]
        })
    } finally {
        let cant
        try {
            cant = parseInt(result1.length)
        } catch (error) {
            cant = 0
        }

        if (cant > 0) {
            const tipo = parseInt(result1[0].desc_tipo)
            const porcentaje = parseInt(result1[0].porc)
            const montoDesc = parseFloat(result1[0].monto_dec)
            const descMax = parseFloat(result1[0].desc_max)
            const montoMin = parseFloat(result1[0].monto_min)


            resultado = {
                tipo,
                porcentaje,
                montoDesc,
                descMax,
                montoMin
            }

            respuesta = {
                status: 200,
                result: resultado
            }

            res.send(respuesta)
        } else {
            respuesta = {
                status: 501,
                error: "No hay cupón o está vencido"
            }

            res.send(respuesta)
        }
    }
})

module.exports = AplicarCupon
