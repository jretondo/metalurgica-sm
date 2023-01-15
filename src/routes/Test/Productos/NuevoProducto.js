const express = require('express')
const NvoHeroId = express()
const Consultador = require("../../../../database/Consultador")
const formatDate = require('../../../lib/Funciones/FormatDate')
const pathimagenes = require("../../Test/Global/UrlImg")
const path = require('path');
const fs = require('fs');

NvoHeroId.post("/test/nvo-prod", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const name = request.name
    const salePrice = request.salePrice
    const shopPrice = request.shopPrice
    const discount = 0
    const shortDescr = request.shortDescr
    const longDescr = request.longDescr
    const proveedor = request.proveedor
    const categoryPrev = request.category
    const Fcat = categoryPrev.slice(0, 1).toUpperCase();
    const Ecat = categoryPrev.slice(1, categoryPrev.length);
    const category = Fcat + Ecat;

    const subCategoryPrev = request.subCategory
    const Fscat = subCategoryPrev.slice(0, 1).toUpperCase();
    const Escat = subCategoryPrev.slice(1, subCategoryPrev.length);
    const subCategory = Fscat + Escat;

    const cantMaxSale = request.cantMaxSale
    const peso = request.peso
    const sizeX = request.sizeX
    const sizeY = request.sizeY
    const sizeZ = request.sizeZ

    const listaTags = request.listaTags
    const cantImg = request.cantImg

    const listaVarNvas = request.listaVarNvas
    const cantVar = parseInt(listaVarNvas.length)
    const tipoVar = request.tipoVar

    let ind = 0
    if (cantVar > 0) {
        ind = 1
    }

    const listaCopiaImg = request.listaCopiaImg
    const cantCopiasImg = parseInt(listaCopiaImg.length)

    let entorno = await pathimagenes("Productos/")

    const sql1 = `INSERT INTO products_principal (name, price, discount, new, rating, sale_count, short_descr, long_descr, ind, stock, enabled, category, subcategory, precio_compra, fecha_carga, peso, x, y, z, proveedor) VALUES (?, ?, ?, '1', '0', '1', ?, ?, ?, ?, '1', ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const sql2 = `INSERT INTO produscts_tags (id_prod, tag) VALUES (?, ?)`
    const sql3 = `INSERT INTO products_img (id_prod, url_img) VALUES (?, CONCAT('${entorno}', ((SELECT MAX(id) FROM products_img AS ULTIMO) + 1), '.jpg'))`
    const sql4 = `SELECT id FROM products_img WHERE id_prod = ?`
    const sql5 = `INSERT INTO productos_variedades (tipo, variedad, stock, id_prod) VALUES (?, ?, ?, ?)`
    const sqlControlImg = `INSERT INTO products_img (id_prod, url_img) VALUES ('0', 'control')`
    const fechaHoy = formatDate(new Date(), "yyyy-mm-dd")
    let result1
    let result2
    let result3
    let result4
    let result5
    let resultCtrl
    let respuesta

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [name, salePrice, discount, shortDescr, longDescr, ind, cantMaxSale, category, subCategory, shopPrice, fechaHoy, peso, sizeX, sizeY, sizeZ, proveedor]
        })
    } finally {

        const rowsAff = parseInt(result1.affectedRows)

        if (rowsAff > 0) {

            try {
                resultCtrl = await query({
                    sql: sqlControlImg,
                    timeout: 2000
                })
            } finally {

            }
            const idProd = result1.insertId

            const cantTags = parseInt(listaTags.length)

            if (cantTags > 0) {
                listaTags.map(async tag => {
                    try {
                        result2 = await query({
                            sql: sql2,
                            timeout: 2000,
                            values: [idProd, tag]
                        })
                    } finally {

                    }
                })
            }
            if (cantVar > 0) {
                listaVarNvas.map(async variedad => {
                    try {
                        result5 = await query({
                            sql: sql5,
                            timeout: 2000,
                            values: [tipoVar, variedad[0], variedad[1], idProd]
                        })
                    } finally {

                    }
                })
            }
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

            if (cantCopiasImg > 0) {
                listaCopiaImg.map(async links => {
                    try {
                        result3 = await query({
                            sql: sql3,
                            timeout: 2000,
                            values: [idProd]
                        })
                    } finally {
                        const idImg = parseInt(result3.insertId)
                        const ubicacion = path.join('Public', 'Imagenes', 'Productos', idImg + ".jpg")
                        const origen = links.replace("https://nekoadmin.com.ar:3015/public/Imagenes/Productos", path.join('Public', 'Imagenes', 'Productos'))

                        fs.copyFile(origen, ubicacion, (err) => {
                            if (err) throw err
                        })
                    }
                })
            }

            try {
                result4 = await query({
                    sql: sql4,
                    timeout: 2000,
                    values: [idProd]
                })
            } finally {
                respuesta = {
                    status: 200,
                    result: result4
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

module.exports = NvoHeroId