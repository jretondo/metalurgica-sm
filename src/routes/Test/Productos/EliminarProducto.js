const express = require('express')
const EliminarHero = express()
const fs = require('fs').promises
const path = require('path')
const Consultador = require("../../../../database/Consultador")

EliminarHero.post("/test/delete-prod-id", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const idHero = request.id
    const sql1 = `DELETE FROM products_principal WHERE id = ?`
    const sql2 = `SELECT id FROM products_img WHERE id_prod = ?`
    const sql3 = `DELETE FROM products_img WHERE id_prod = ?`
    const sql4 = `DELETE FROM products_extra WHERE id_prod = ?`
    const sql5 = `DELETE FROM produscts_tags WHERE id_prod = ?`
    const sql6 = `DELETE FROM products_stocks_var WHERE id_prod = ?`
    const sql7 = `DELETE FROM productos_variedades WHERE id_prod = ?`

    let result1
    let result2
    let result3
    let result4
    let result5
    let result6
    let result7
    let respuesta

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [idHero]
        })
    } finally {
        const rowsAff = parseInt(result1.affectedRows)

        if (rowsAff > 0) {
            try {
                result2 = await query({
                    sql: sql2,
                    timeout: 2000,
                    values: [idHero]
                })
            } finally {
                result2.map(id => {
                    const imageName = id.id + ".jpg"
                    const directory = path.join(__dirname, '..', '..', '..', '..', 'Public', 'Imagenes', 'Productos', imageName)
                    fs.rmdir(directory, { recursive: true })
                })
            }

            try {
                result3 = await query({
                    sql: sql3,
                    timeout: 2000,
                    values: [idHero]
                })
            } finally {

            }
            try {
                result4 = await query({
                    sql: sql4,
                    timeout: 2000,
                    values: [idHero]
                })
            } finally {

            }
            try {
                result5 = await query({
                    sql: sql5,
                    timeout: 2000,
                    values: [idHero]
                })
            } finally {

            }
            try {
                result6 = await query({
                    sql: sql6,
                    timeout: 2000,
                    values: [idHero]
                })
            } finally {

            }
            try {
                result7 = await query({
                    sql: sql7,
                    timeout: 2000,
                    values: [idHero]
                })
            } finally {

            }

            respuesta = {
                status: 200,
                result: result1
            }
            res.send(respuesta)
        } else {
            respuesta = {
                status: 500,
                error: "No se encontró el email colocado!"
            }
            res.send(respuesta)
        }
    }

})

module.exports = EliminarHero