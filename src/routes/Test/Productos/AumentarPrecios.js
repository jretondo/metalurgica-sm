const express = require('express')
const AumentarPrecios = express()
const Consultador = require("../../../../database/Consultador")

AumentarPrecios.post('/test/aumentoPrecio', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const porcentaje = (request.porcentaje / 100) + 1
    const searchBool = request.searchBool
    const searchItem = "%" + request.searchItem + "%"
    const redondear = request.redondear
    let redondo = ""
    if (!redondear) {
        redondo = ", 2"
    }
    let sql1
    let result1
    let valores1
    let respuesta

    if (searchBool) {
        sql1 = `UPDATE products_principal SET precio_compra = ROUND(precio_compra * ${porcentaje} ${redondo}), price = ROUND(price * ${porcentaje} ${redondo}), discount = ROUND(discount * ${porcentaje} ${redondo}) WHERE name LIKE ? OR category LIKE ? OR subcategory LIKE ? OR proveedor LIKE ?`
        valores1 = [searchItem, searchItem, searchItem, searchItem]
    } else {
        sql1 = `UPDATE products_principal SET precio_compra = ROUND(precio_compra * ${porcentaje} ${redondo}), price = ROUND(price * ${porcentaje} ${redondo}), discount = ROUND(discount * ${porcentaje} ${redondo})`
        valores1 = []
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
})

module.exports = AumentarPrecios