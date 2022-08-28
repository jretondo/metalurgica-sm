const express = require('express')
const EtiquetasGral = express()
const Consultador = require("../../../../database/Consultador")
const SecureVerify = require("../../../lib/Funciones/SecureVerify")

EtiquetasGral.post('/test/etiquetasGral', async (req, res) => {
    const query = Consultador()
    const token = req.headers["x-access-token"]
    const request = req.body
    const searchBool = request.searchBool
    const searchItem = "%" + request.searchItem + "%"
    const etiqueta = request.etiqueta
    const sql2 = ` INSERT INTO produscts_tags(id_prod, tag) VALUES(?, ?) `
    let sql1
    let result1
    let result2
    let valores1
    let respuesta

    const isSecure = await SecureVerify(token)

    if (isSecure) {

        if (searchBool) {
            sql1 = ` SELECT id FROM products_principal WHERE name LIKE ? OR category LIKE ? OR subcategory LIKE ? OR proveedor LIKE ? `
            valores1 = [searchItem, searchItem, searchItem, searchItem]
        } else {
            sql1 = ` SELECT id FROM products_principal `
            valores1 = []
        }

        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: valores1
            })
        } finally {

            console.log(`result1`, result1)
            let cant
            try {
                cant = parseInt(result1.length)
            } catch (error) {
                cant = 0
            }
            if (cant > 0) {
                result1.map(async (item, key) => {
                    const idProd = item.id
                    try {
                        result2 = await query({
                            sql: sql2,
                            timeout: 200,
                            values: [idProd, etiqueta]
                        })
                    } finally {
                        if (key === parseInt(cant - 1)) {
                            respuesta = {
                                status: 200,
                                result: ""
                            }
                            res.send(respuesta)
                        }
                    }
                })
            } else {
                respuesta = {
                    status: 501,
                    error: "No hay productos listados"
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

module.exports = EtiquetasGral