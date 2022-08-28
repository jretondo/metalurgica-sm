const express = require('express')
const UpdatePricesCourier = express()
const ConsultaGeneral = require('../../../lib/Funciones/Generales/ConsultaBaseDatos');
const VerifySecure = require('../../../lib/Funciones/SecureVerify');

UpdatePricesCourier.post('/test/UpdatePricesCourier', async (req, res) => {
    const token = req.headers["x-access-token"];
    const isSecure = await VerifySecure(token)
    const sql1 = ` UPDATE correo_precios SET precio = ? WHERE peso = ? AND zona = ? AND domicilio = ? `
    let result1 = []

    if (isSecure) {
        const request = req.body
        const retiroPrices = request.preciosRet
        const domicilioPrices = request.preciosDom
        await Promise.all(
            retiroPrices.map(async (item1, key1) => {
                let peso = 0.5
                switch (key1) {
                    case 0:
                        peso = 0.5
                        break;
                    case 1:
                        peso = 1
                        break;
                    case 2:
                        peso = 2
                        break;
                    case 3:
                        peso = 3
                        break;
                    case 4:
                        peso = 5
                        break;
                    case 5:
                        peso = 10
                        break;
                    case 6:
                        peso = 15
                        break;
                    case 7:
                        peso = 20
                        break;
                    case 8:
                        peso = 25
                        break;
                    default:
                        peso = 0.5
                        break;
                }
                item1.map(async (item2, key2) => {
                    let zona = 1
                    switch (key2) {
                        case 0:
                            zona = 1
                            break;
                        case 1:
                            zona = 2
                            break;
                        case 2:
                            zona = 3
                            break;
                        case 3:
                            zona = 4
                            break;
                        default:
                            zona = 1
                            break;
                    }

                    const nvoPrecio = parseFloat(item2)
                    result1 = await ConsultaGeneral(sql1, [nvoPrecio, peso, zona, 0])
                })
            })
        )


        await Promise.all(
            domicilioPrices.map(async (item1, key1) => {
                let peso = 0.5
                switch (key1) {
                    case 0:
                        peso = 0.5
                        break;
                    case 1:
                        peso = 1
                        break;
                    case 2:
                        peso = 2
                        break;
                    case 3:
                        peso = 3
                        break;
                    case 4:
                        peso = 5
                        break;
                    case 5:
                        peso = 10
                        break;
                    case 6:
                        peso = 15
                        break;
                    case 7:
                        peso = 20
                        break;
                    case 8:
                        peso = 25
                        break;
                    default:
                        peso = 0.5
                        break;
                }
                item1.map(async (item2, key2) => {
                    let zona = 1
                    switch (key2) {
                        case 0:
                            zona = 1
                            break;
                        case 1:
                            zona = 2
                            break;
                        case 2:
                            zona = 3
                            break;
                        case 3:
                            zona = 4
                            break;
                        default:
                            zona = 1
                            break;
                    }

                    const nvoPrecio = parseFloat(item2)
                    result1 = await ConsultaGeneral(sql1, [nvoPrecio, peso, zona, 1])
                })
            })
        )
        res.send({
            status: 200,
            result: "Precios actualizados"
        })
    } else {
        res.send({
            status: 403,
            error: "No tiene los permisos"
        })
    }
})

module.exports = UpdatePricesCourier