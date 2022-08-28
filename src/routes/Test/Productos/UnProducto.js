const express = require('express')
const DetalleProd = express()
const Consultador = require("../../../../database/Consultador")

DetalleProd.get("/test/product-detalle/:id", async (req, res) => {
    const request = req.params
    const idProd = request.id
    const query = Consultador()
    const sql1 = `SELECT * FROM products_principal WHERE id = ?`
    const sql3 = `SELECT * FROM produscts_tags WHERE id_prod = ? ORDER BY tag`
    const sql4 = `SELECT * FROM products_img WHERE id_prod = ? ORDER BY id`

    const sql5 = `SELECT variedad, stock FROM productos_variedades WHERE id_prod = ?`
    const sql6 = `SELECT DISTINCT tipo FROM productos_variedades WHERE id_prod = ?`

    let result1
    let result3
    let result4
    let result5
    let result6
    let tipoVar
    let listaVar = []
    let productsData = []
    let ultimmo = -1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [idProd]
        })
    } finally {
        const cantidad = result1.length - 1
        if (cantidad < 0) {
            resultado = {
                status: 500,
                result: []
            }
            res.send(resultado)
        } else {
            result1.map(async (product) => {
                let categories = []
                const name = product.name
                const price = product.price
                const discount = product.discount
                const nuevo1 = parseInt(product.new)
                let nuevo
                if (nuevo1 === 1) {
                    nuevo = true
                } else {
                    nuevo = false
                }
                const rating = product.rating
                const saleCount = product.sale_count
                const shortDescription = product.short_descr
                const fullDescription = product.long_descr
                const compra = product.precio_compra
                const stock1 = product.stock
                const categoriaInd = product.category
                const subCategoriaind = product.subcategory
                const peso = product.peso
                const sizeX = product.x
                const sizeY = product.y
                const sizeZ = product.z
                const proveedor = product.proveedor

                const ind = parseInt(product.ind)

                if (ind === 1) {
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
                            listaVar.push([variedades.variedad, variedades.stock])
                        })
                    }
                }

                categories.push(categoriaInd)
                categories.push(subCategoriaind)

                let tags = []
                let images = []
                let infoExtra = []

                try {
                    result3 = await query({
                        sql: sql3,
                        timeout: 2000,
                        values: [idProd]
                    })
                } finally {
                    result3.map((tag) => {
                        tags.push(tag.tag)
                    })
                }

                try {
                    result4 = await query({
                        sql: sql4,
                        timeout: 2000,
                        values: [idProd]
                    })
                } finally {
                    result4.map((image) => {
                        images.push([image.url_img, image.id])
                    })
                }

                if (ind === 1) {
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
                        "precioCompra": compra,
                        "peso": peso,
                        "sizeX": sizeX,
                        "sizeY": sizeY,
                        "sizeZ": sizeZ,
                        "listaVarNvas": listaVar,
                        "tipoVar": tipoVar,
                        "proveedor": proveedor
                    })
                    ultimmo = ultimmo + 1

                    if (cantidad === ultimmo) {
                        resultado = {
                            status: 200,
                            result: productsData
                        }
                        res.send(resultado)
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
                        "precioCompra": compra,
                        "peso": peso,
                        "sizeX": sizeX,
                        "sizeY": sizeY,
                        "sizeZ": sizeZ,
                        "listaVarNvas": [],
                        "tipoVar": "",
                        "proveedor": proveedor
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
            })
        }

    }
})

module.exports = DetalleProd