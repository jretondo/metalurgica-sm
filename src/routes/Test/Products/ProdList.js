const express = require('express')
const ProdList = express()
const Consultador = require("../../../../database/Consultador")
const DiferenciaFechas = require("../../../lib/Funciones/DiferenciaFechas")
const formatDate = require("../../../lib/Funciones/FormatDate2")
const formatNumber = require("../../../lib/Funciones/NumberFormat")

ProdList.get("/test/product-list", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT * FROM products_principal ORDER BY ind ASC`
    const sql3 = `SELECT * FROM produscts_tags WHERE id_prod = ?`
    const sql4 = `SELECT * FROM products_img WHERE id_prod = ?`
    const sql5 = `SELECT variedad, stock FROM productos_variedades WHERE id_prod = ?`
    const sql6 = `SELECT DISTINCT tipo FROM productos_variedades WHERE id_prod = ?`
    const sql7 = `SELECT * FROM product_comments WHERE id_prod = ? ORDER BY id_original_comment, id`

    let result1
    let result3
    let result4
    let result5
    let result6
    let result7

    let productsData = []
    let ultimmo = -1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000
        })
    } finally {
        const cantidad = result1.length - 1

        if (result1.length > 0) {
            result1.map(async (product) => {
                let categories = []
                let nuevo
                const fechaCarga = product.fecha_carga
                const diasIngreso = await DiferenciaFechas(fechaCarga)

                if (diasIngreso < 30) {
                    nuevo = true
                } else {
                    nuevo = false
                }

                const idProd = product.id
                const name = product.name
                const price = product.price
                const priceStr = await formatNumber(price, 2)

                let discount = product.discount
                let discountStr = await formatNumber(discount, 2)


                const rating = product.rating
                const saleCount = product.sale_count
                const shortDescription = product.short_descr
                const fullDescription = product.long_descr
                const indumentaria = parseInt(product.ind)
                const enabled = parseInt(product.enabled)
                const peso = product.peso
                const sizeX = product.x
                const sizeY = product.y
                const sizeZ = product.z
                const costoProd = product.precio_compra
                const hoy = new Date()
                const vtoPromo = new Date(product.vto_desc)
                if (hoy > vtoPromo) {
                    discount = 0
                    discountStr = await formatNumber(discount, 2)
                }
                let stock1
                if (enabled === 1) {
                    stock1 = product.stock
                } else {
                    stock1 = 0
                }
                let discountedPriceStr = await formatNumber((price - discount), 2)
                if (enabled === 1) {


                    const categoriaInd = product.category
                    const subCategoriaind = product.subcategory
                    categories.push(categoriaInd)
                    categories.push(subCategoriaind)

                    let tags = []
                    let images = []
                    let comments = []

                    try {
                        result3 = await query({
                            sql: sql3,
                            timeout: 2000,
                            values: [idProd]
                        })
                        console.log('result3 :>> ', result3);
                    } finally {
                        result3.map((tag) => {
                            tags.push(tag.tag)
                        })

                        tags.push(categoriaInd)
                        tags.push(subCategoriaind)
                    }

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

                    try {
                        result7 = await query({
                            sql: sql7,
                            timeout: 2000,
                            values: [idProd]
                        })
                    } finally {
                        const cantComment = parseInt(result7.length)
                        if (cantComment > 0) {
                            result7.map((comment) => {
                                comments.push({
                                    id: comment.id,
                                    name: comment.name,
                                    rating: comment.rating,
                                    review: comment.review,
                                    response: comment.response,
                                    date: formatDate(comment.date)
                                })
                            })
                        }
                    }

                    if (indumentaria === 1) {
                        let variations = []
                        let sizes = []
                        let tipoVar
                        try {
                            result5 = await query({
                                sql: sql6,
                                timeout: 2000,
                                values: [idProd]
                            })
                        } finally {
                            tipoVar = result5[0].tipo
                        }
                        try {
                            result6 = await query({
                                sql: sql5,
                                timeout: 2000,
                                values: [idProd]
                            })
                        } finally {
                            result6.map(variedades => {
                                sizes.push({
                                    "name": variedades.variedad,
                                    "stock": variedades.stock
                                })

                            })
                            variations.push({
                                "color": tipoVar,
                                "labelColor": tipoVar,
                                "size": sizes
                            })
                            productsData.push({
                                "id": idProd,
                                "sku": "asdf" + idProd,
                                "name": name,
                                "price": price,
                                "discount": discount,
                                "new": nuevo,
                                "rating": rating,
                                "saleCount": saleCount,
                                "category": categories,
                                "tag": tags,
                                "variation": variations,
                                "image": images,
                                "shortDescription": shortDescription,
                                "fullDescription": fullDescription,
                                "comments": comments,
                                "priceStr": priceStr,
                                "discountStr": discountStr,
                                "discountedPriceStr": discountedPriceStr,
                                "peso": peso,
                                "sizeX": sizeX,
                                "sizeY": sizeY,
                                "sizeZ": sizeZ,
                                "costoProd": costoProd
                            })
                            ultimmo = ultimmo + 1
                            if (cantidad === ultimmo) {
                                resultado = {
                                    status: 200,
                                    result: productsData
                                }
                                res.send(resultado)
                            }
                        }
                    } else {
                        productsData.push({
                            "id": idProd,
                            "sku": "asdf" + idProd,
                            "name": name,
                            "price": price,
                            "discount": discount,
                            "new": nuevo,
                            "rating": rating,
                            "saleCount": saleCount,
                            "category": categories,
                            "tag": tags,
                            "stock": stock1,
                            "image": images,
                            "shortDescription": shortDescription,
                            "fullDescription": fullDescription,
                            "comments": comments,
                            "priceStr": priceStr,
                            "discountStr": discountStr,
                            "discountedPriceStr": discountedPriceStr,
                            "peso": peso,
                            "sizeX": sizeX,
                            "sizeY": sizeY,
                            "sizeZ": sizeZ,
                            "costoProd": costoProd
                        })
                        ultimmo = ultimmo + 1
                        if (cantidad === ultimmo) {
                            resultado = {
                                status: 200,
                                result: productsData
                            }
                            res.send(resultado)
                        }
                    }
                } else {
                    ultimmo = ultimmo + 1
                    if (cantidad === ultimmo) {
                        resultado = {
                            status: 200,
                            result: productsData
                        }
                        res.send(resultado)
                    }
                }
            })
        } else {
            resultado = {
                status: 500,
                result: []
            }
            res.send(resultado)
        }

    }
})

module.exports = ProdList