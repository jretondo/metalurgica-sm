const express = require('express')
const ProveedoresList = express()
const Consultador = require("../../../../database/Consultador")

ProveedoresList.get('/test/proveedores', async (req, res) => {
    const query = Consultador()
    const sql = `SELECT DISTINCT proveedor FROM products_principal WHERE proveedor <> ""`
    let result
    let resultado = []
    let respuesta = []

    try {
        result = await query({
            sql: sql,
            timeout: 2000
        })
    } finally {
        const cant = parseInt(result.length)
        if (cant > 0) {
            result.map(proveedor => {

                resultado.push(proveedor.proveedor)

            })

            respuesta = {
                status: 200,
                result: resultado
            }

            res.send(respuesta);
        } else {
            respuesta = {
                status: 401,
                result: "",
                error: "No hay proveedores para mostrar"
            }
            res.send(respuesta);
        }
    }
})

module.exports = ProveedoresList