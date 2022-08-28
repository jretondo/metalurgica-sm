const express = require('express')
const ProdList = express()
const Consultador = require("../../../../database/Consultador")
const formatMoney = require("../../../lib/Funciones/NumberFormat")

ProdList.post("/test/product-list2", async (req, res) => {
    const query = Consultador()
    const request = req.body
    const pageAct = parseInt(request.pageAct)
    const desde = ((pageAct - 1) * 5)
    const searchBool = request.searchBool
    const searchItem = "%" + request.searchItem + "%"
    let sql1
    let sql5
    let valores1
    if (searchBool) {
        sql1 = `SELECT * FROM products_principal WHERE name LIKE ? OR category LIKE ? OR subcategory LIKE ? OR proveedor LIKE ? ORDER BY name LIMIT ?, 5`
        sql5 = `SELECT COUNT(*) as TOTAL FROM products_principal WHERE name LIKE ? OR category LIKE ? OR subcategory LIKE ? OR proveedor LIKE ?`
        valores1 = [searchItem, searchItem, searchItem, searchItem, desde]
    } else {
        sql1 = `SELECT * FROM products_principal ORDER BY name LIMIT ?, 5`
        sql5 = `SELECT COUNT(*) as TOTAL FROM products_principal`
        valores1 = [desde]
    }
    const sql4 = `SELECT * FROM products_img WHERE id_prod = ? ORDER BY id LIMIT 1`

    let result1
    let result4
    let result5
    let resultado
    let array
    let productsData = []
    let ultimmo = -1
    let cantTotal
    let paginas = []
    let ultPagina = 1

    try {
        result5 = await query({
            sql: sql5,
            timeout: 2000,
            values: valores1
        })
    } finally {

        cantTotal = result5[0].TOTAL
        if (cantTotal === 0) {
            array = {
                listado: [],
                cantTotal: 0,
                totalPag: 0
            }
            resultado = {
                status: 200,
                result: array
            }
            res.send(resultado)
        } else {
            if (cantTotal < 5) {
                paginas.push(1)
            } else {
                const paginasFloat = parseFloat(cantTotal / 5)
                const paginasInt = parseInt(cantTotal / 5)
                let totalPag
                if (paginasFloat > paginasInt) {
                    totalPag = paginasInt + 1
                } else {
                    if (paginasInt === 0) {
                        totalPag = 1
                    } else {
                        totalPag = paginasInt
                    }
                }

                ultPagina = totalPag

                for (let i = 0; i < totalPag; i++) {
                    const paginaLista = i + 1
                    const limiteInf = pageAct - 3
                    const limiteSup = pageAct + 3
                    if (paginaLista > limiteInf && paginaLista < limiteSup)
                        paginas.push(paginaLista)
                }
            }
            try {
                result1 = await query({
                    sql: sql1,
                    timeout: 2000,
                    values: valores1
                })
            } finally {
                const cantidad = result1.length - 1

                result1.map(async (product) => {
                    const idProd = product.id
                    const name = product.name
                    const price = "$ " + formatMoney(product.price)
                    let discount = "$ " + formatMoney(product.discount)
                    const stock1 = product.stock
                    const enabled = product.enabled
                    const categoria = product.category
                    const subCategoria = product.subcategory
                    const proveedor = product.proveedor
                    const vtoDesc = product.vto_desc
                    const vencimiento = new Date(vtoDesc)
                    const hoy = new Date()
                    if (vencimiento < hoy) {
                        discount = "$ " + formatMoney(0)
                    }
                    let images = []

                    try {
                        result4 = await query({
                            sql: sql4,
                            timeout: 2000,
                            values: [idProd]
                        })
                    } finally {
                        result4.map((image) => {
                            images.push(image.url_img)
                        })
                    }

                    productsData.push({
                        "id": idProd,
                        "sku": "asdf" + idProd,
                        "name": name,
                        "price": price,
                        "discount": discount,
                        "stock": stock1,
                        "image": images,
                        "enabled": enabled,
                        "categoria": categoria,
                        "subCategoria": subCategoria,
                        "proveedor": proveedor
                    })

                    ultimmo = ultimmo + 1
                    if (cantidad === ultimmo) {
                        array = {
                            listado: productsData,
                            cantTotal: paginas,
                            totalPag: ultPagina
                        }

                        resultado = {
                            status: 200,
                            result: array
                        }

                        res.send(resultado)
                    }

                })
            }
        }
    }
})

module.exports = ProdList