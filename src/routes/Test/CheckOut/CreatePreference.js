const express = require('express')
const CreatePreference = express()
const mercadopago = require("mercadopago")
const Consultador = require("../../../../database/Consultador")
const formatDate = require("../../../lib/Funciones/FormatDate")

CreatePreference.post('/test/createPreference', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const cartItems = request.cartItems
    const costoEnvio = request.costoEnvio
    const cupon = request.cupon
    const ahora = formatDate(new Date(), "yyyy-mm-dd hor:min:seg")
    const sql1 = ` SELECT * FROM cupones_tb WHERE cupon = ? AND vto_cupon > ? `
    let result1
    let totalDescuento = 0

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [cupon, ahora]
        })
    } finally {
        let cant
        try {
            cant = parseInt(result1.length)
        } catch (error) {
            cant = 0
        }

        if (cant > 0) {
            const tipo = parseInt(result1[0].desc_tipo)
            const porcentaje = parseInt(result1[0].porc)
            const montoDesc = parseFloat(result1[0].monto_dec)
            const descMax = parseFloat(result1[0].desc_max)
            const montoMin = parseFloat(result1[0].monto_min)

            const TotalImporte = async () => {
                let precioTotal = 0
                // eslint-disable-next-line
                cartItems.map((cartItem, key) => {
                    precioTotal = precioTotal + parseFloat(cartItem.price - cartItem.discount)
                })
                return precioTotal
            }

            const totalProductos = await TotalImporte()

            if (tipo === 0) {
                if (totalProductos > montoMin) {
                    totalDescuento = montoDesc
                }
            } else {
                if (totalProductos >= montoMin) {
                    const descuentoPAplicar = parseFloat((porcentaje / 100) * totalProductos)
                    if (descuentoPAplicar > descMax) {
                        totalDescuento = descMax
                    } else {
                        totalDescuento = descuentoPAplicar
                    }
                }
            }
        }

        mercadopago.configurations.setAccessToken("APP_USR-5475928734302525-040812-b6dfa99f86cfae784d17fb09033cf4b9-500119393");

        let items = [{
            title: "Productos de Pesca - Córdoba Baitcast",
            unit_price: Number(0),
            quantity: 1
        }, {
            title: "Costo de Envío",
            unit_price: Number(costoEnvio),
            quantity: 1
        }]

        if (totalDescuento > 0) {
            items.push({
                title: "Descuento por cupón",
                unit_price: - totalDescuento,
                quantity: 1
            })
        }

        cartItems.map(item => {
            const producto = item.name
            const precio = Number(item.price)
            const descuento = Number(item.discount)
            const cantidad = Number(item.quantity)
            const finalPrice = precio - descuento
            const image = item.image[0]
            items.push({
                title: producto,
                unit_price: finalPrice,
                quantity: cantidad,
                picture_url: image
            })
        })

        let preference = {
            items: items,
            back_urls: {
                "success": "https://cordobabaitcast.com.ar/my-account/",
                "failure": "https://cordobabaitcast.com.ar/checkout/",
                "pending": "https://cordobabaitcast.com.ar/checkout/"
            },
            auto_return: 'approved',
            "payment_methods": {
                "excluded_payment_types": [
                    {
                        "id": "ticket"
                    }
                ],
                "installments": 12
            }
        };

        mercadopago.preferences.create(preference)
            .then(function (response) {
                res.send({
                    id: response.body.id,
                    initPoint: response.body.init_point,
                    initPointSandBox: response.body.sandbox_init_point
                })
            }).catch(function (error) {
                res.send(error);
            });
    }
})

module.exports = CreatePreference