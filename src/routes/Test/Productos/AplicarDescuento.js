const express = require('express')
const AplicarDescuento = express()
const Consultador = require("../../../../database/Consultador")
const SecureVerify = require("../../../lib/Funciones/SecureVerify")

AplicarDescuento.post('/test/aplicarDescuento', async (req, res) => {
    const query = Consultador()
    const token = req.headers["x-access-token"]
    const request = req.body
    const porcentaje = (request.porcentaje / 100)
    const searchBool = request.searchBool
    const searchItem = "%" + request.searchItem + "%"
    const redondear = request.redondear
    const vtoDesc = request.vtoDesc
    let redondo = ""
    if (!redondear) {
        redondo = ", 2"
    }
    let sql1
    let result1
    let valores1
    let respuesta

    const isSecure = await SecureVerify(token)

    if (isSecure) {
        if (searchBool) {
            sql1 = `UPDATE products_principal SET discount = ROUND(price * ${porcentaje} ${redondo}), vto_desc = ? WHERE name LIKE ? OR category LIKE ? OR subcategory LIKE ? OR proveedor LIKE ?`
            valores1 = [vtoDesc, searchItem, searchItem, searchItem, searchItem]
        } else {
            sql1 = ` UPDATE products_principal SET discount = ROUND(price * ${porcentaje} ${redondo}), vto_desc = ? `
            valores1 = [vtoDesc]
        }

        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: valores1
            })
        } finally {
            respuesta = {
                status: 200,
                result: ""
            }

            res.send(respuesta);
        }
    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }

})

module.exports = AplicarDescuento