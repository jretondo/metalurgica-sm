const express = require('express')
const ModProd = express()
const Consultador = require("../../../../database/Consultador")
const fs = require('fs').promises
const path = require('path')
const pathimagenes = require("../../Test/Global/UrlImg")

ModProd.post("/test/mod-prod-acc", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const idProd = request.id
    const name = request.name
    const salePrice = request.salePrice
    const shopPrice = request.shopPrice
    const discount = 0
    const shortDescr = request.shortDescr
    const longDescr = request.longDescr
    const category = request.category
    const subCategory = request.subCategory
    const cantMaxSale = request.cantMaxSale
    const peso = request.peso
    const sizeX = request.sizeX
    const sizeY = request.sizeY
    const sizeZ = request.sizeZ
    const proveedor = request.proveedor

    const listaTags = request.listaTags
    const cantImg = request.cantImg
    const listaImgEliminadas = request.lisImgBorradas

    const listaVarNvas = request.listaVarNvas
    const cantVar = parseInt(listaVarNvas.length)
    const tipoVar = request.tipoVar

    let ind = 0
    if (cantVar > 0) {
        ind = 1
    }

    let entorno = await pathimagenes("Productos/")

    const sql1 = `UPDATE products_principal SET name = ?, price = ?, discount = ?, short_descr = ?, long_descr = ?, stock = ?, category = ?, subcategory = ?, precio_compra = ?, peso = ?, x = ?, y = ?, z = ?, ind = ?, proveedor = ? WHERE (id = ?)`
    const sql2 = `DELETE FROM products_img WHERE id = ?`
    const sql3 = `INSERT INTO products_img (id_prod, url_img) VALUES (?, CONCAT('${entorno}', ((SELECT MAX(id) FROM products_img AS ULTIMO) + 1), '.jpg'))`
    const sql4 = `DELETE FROM produscts_tags WHERE id_prod = ?`
    const sql5 = `INSERT INTO produscts_tags (id_prod, tag) VALUES (?, ?)`
    const sql8 = `SELECT id FROM products_img WHERE id_prod = ? ORDER BY id DESC LIMIT ${cantImg}`
    const sql9 = `DELETE FROM productos_variedades WHERE id_prod = ?`
    const sql10 = `INSERT INTO productos_variedades (tipo, variedad, stock, id_prod) VALUES (?, ?, ?, ?)`

    const sqlControlImg = `INSERT INTO products_img (id_prod, url_img) VALUES ('0', 'control')`
    let result1
    let result2
    let result3
    let result4
    let result5
    let result8
    let result9
    let result10
    let resultCtrl
    let respuesta

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [name, salePrice, discount, shortDescr, longDescr, cantMaxSale, category, subCategory, shopPrice, peso, sizeX, sizeY, sizeZ, ind, proveedor, idProd]
        })
    } finally {
        const rowsAff1 = parseInt(result1.affectedRows)

        if (rowsAff1 > 0) {
            try {
                resultCtrl = await query({
                    sql: sqlControlImg,
                    timeout: 2000
                })
            } finally {

            }

            try {
                result9 = await query({
                    sql: sql9,
                    timeout: 2000,
                    values: [idProd]
                })
            } finally {
                if (cantVar > 0) {
                    listaVarNvas.map(async variedad => {
                        try {
                            result10 = await query({
                                sql: sql10,
                                timeout: 2000,
                                values: [tipoVar, variedad[0], variedad[1], idProd]
                            })
                        } finally {

                        }
                    })
                }
            }


            const cantImgDeleted = parseInt(listaImgEliminadas.length)
            if (cantImgDeleted > 0) {
                listaImgEliminadas.map(async idImg => {
                    const imageName = idImg + ".jpg"
                    const directory = path.join(__dirname, '..', '..', '..', '..', 'Public', 'Imagenes', 'Productos', imageName)
                    fs.rmdir(directory, { recursive: true })
                    try {
                        result2 = await query({
                            sql: sql2,
                            timeout: 2000,
                            values: [idImg]
                        })
                    } finally {

                    }
                })
            }

            if (cantImg > 0) {
                for (let i = 0; i < cantImg; i++) {
                    try {
                        result3 = await query({
                            sql: sql3,
                            timeout: 2000,
                            values: [idProd]
                        })
                    } finally {

                    }
                }
            }

            try {
                result4 = await query({
                    sql: sql4,
                    timeout: 2000,
                    values: [idProd]
                })
            } finally {
                const cantTags = parseInt(listaTags.length)

                if (cantTags > 0) {
                    listaTags.map(async tag => {
                        try {
                            result5 = await query({
                                sql: sql5,
                                timeout: 2000,
                                values: [idProd, tag]
                            })
                        } finally {

                        }
                    })
                }
            }

            try {
                result8 = await query({
                    sql: sql8,
                    timeout: 2000,
                    values: [idProd]
                })
            } finally {
                respuesta = {
                    status: 200,
                    result: result8
                }
                res.send(respuesta)
            }

        } else {
            respuesta = {
                status: 500,
                error: "No se encontró el email colocado!"
            }
            res.send(respuesta)
        }
    }

})

module.exports = ModProd