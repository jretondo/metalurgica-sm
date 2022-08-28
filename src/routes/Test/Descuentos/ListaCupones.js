const express = require('express')
const ListaCupones = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")
const formatDate = require("../../../lib/Funciones/FormatDate")
const formatMoney = require("../../../lib/Funciones/NumberFormat")

ListaCupones.post('/test/ListaCupones/:page', async (req, res) => {
    const token = req.headers["x-access-token"]
    const query = Consultador()
    const page = parseInt(req.params.page)
    const palabra = "%" + req.body.palabra + "%"
    const busquedaBool = req.body.busquedaBool
    const isSecure = await SecureVerify(token)

    let desde
    if (page === 1) {
        desde = 0
    } else {
        desde = (page - 1) * 10
    }

    let sql1
    let sql4
    let result1
    let result4
    let values1
    let values4

    let seguir = true
    let resultado = []
    let respuesta = []
    let array = []
    let cantTotal = 0
    let paginas = []
    let ultPagina = 1

    if (busquedaBool) {
        sql1 = ` SELECT * FROM cupones_tb WHERE cupon LIKE ? ORDER BY vto_cupon DESC LIMIT ?, 10 `

        sql4 = ` SELECT COUNT(*) as TOTAL FROM cupones_tb WHERE cupon LIKE ? ORDER BY vto_cupon DESC `
        values1 = [palabra, desde]
        values4 = [palabra]
    } else {
        sql1 = ` SELECT * FROM cupones_tb ORDER BY vto_cupon DESC LIMIT ?, 10 `
        sql4 = ` SELECT COUNT(*) as TOTAL FROM cupones_tb ORDER BY vto_cupon DESC `
        values1 = [desde]
        values4 = []
    }

    if (isSecure) {
        if (seguir) {

            try {
                result4 = await query({
                    sql: sql4,
                    timeout: 2000,
                    values: values4
                })
            } finally {

                cantTotal = result4[0].TOTAL
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
                    if (cantTotal < 10) {
                        paginas.push(1)
                    } else {
                        const paginasFloat = parseFloat(cantTotal / 10)
                        const paginasInt = parseInt(cantTotal / 10)
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
                            const limiteInf = page - 3
                            const limiteSup = page + 3
                            if (paginaLista > limiteInf && paginaLista < limiteSup)
                                paginas.push(paginaLista)
                        }

                    }

                }

                try {
                    result1 = await query({
                        sql: sql1,
                        timeout: 2000,
                        values: values1
                    })
                } finally {

                    let cant

                    try {
                        cant = parseInt(result1.length)
                    } catch (error) {
                        cant = 0
                    }

                    if (cant > 0) {
                        result1.map(async (item, key) => {

                            const id = item.id
                            const cuponName = item.cupon
                            const tipo = parseInt(item.desc_tipo)
                            const porcentaje = parseInt(item.porc)
                            const descCuponNum = parseFloat(item.monto_dec)
                            const descCuponStr = formatMoney(descCuponNum)
                            const descMax = parseFloat(item.desc_max)
                            const descMaxStr = formatMoney(descMax)
                            const montoMin = parseFloat(item.monto_min)
                            const montoMinStr = formatMoney(montoMin)
                            const stock = parseInt(item.max_cant)
                            const vtoCupon = formatDate(item.vto_cupon, "dd/mm/yyyy")

                            resultado.push({
                                id,
                                cuponName,
                                tipo,
                                porcentaje,
                                descCuponNum,
                                descCuponStr,
                                descMax,
                                descMaxStr,
                                montoMin,
                                montoMinStr,
                                stock,
                                vtoCupon
                            })

                            if ((parseInt(cant - 1) === key)) {
                                array = {
                                    listado: resultado,
                                    cantTotal: paginas,
                                    totalPag: ultPagina
                                }

                                respuesta = {
                                    status: 200,
                                    result: array
                                }
                                res.send(respuesta)
                            }
                        })
                    } else {
                        respuesta = {
                            status: 201,
                            result1: []
                        }
                        res.send(respuesta)
                    }
                }
            }
        } else {
            respuesta = {
                status: 500,
                error: "Error en la consulta"
            }
            res.send(respuesta)
        }
    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }


})

module.exports = ListaCupones