const express = require('express')
const GetLocation = express()
const jwt = require("jsonwebtoken")
const Consultador = require("../../../../database/Consultador")
const GetDirect = require("../../../lib/Funciones/GetDirectionGoogle")

GetLocation.post('/test/GetLocation', async (req, res) => {
    const token = req.headers['x-access-token']
    const query = Consultador()
    const latitud = req.body.latitud
    const longitud = req.body.longitud
    const tipo = parseInt(req.body.tipo)
    const dataVisitor = req.body.dataVisit
    const browser = dataVisitor.browser.name
    let typeDevice = dataVisitor.device.type
    let device = dataVisitor.device.vendor
    if (typeDevice === undefined) {
        typeDevice = "desktop"
        device = dataVisitor.os.name
    }
    let tipoDescr
    if (tipo === 0) {
        tipoDescr = "VISITA"
    } else if (tipo === 1) {
        tipoDescr = "CARGA DE PRODUCTOS AL CARRITO"
    } else if (tipo === 2) {
        tipoDescr = "INGRESO AL CARRITO"
    } else if (tipo === 3) {
        tipoDescr = "INGRESO AL CHECKOUT"
    } else if (tipo === 4) {
        tipoDescr === "COMPRA"
    } else if (tipo === 5) {
        tipoDescr === "CANCELACION"
    }
    const ip = req.ip
    let sql1
    const sql2 = ` INSERT INTO actividad_usu(tipo,descr_tipo,latitud,longitud,id_usu,ip_usu,provincia,ciudad,navegador,dispositivo,dispositivo_tipo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `
    let result1
    let result2
    let idUsu = 0
    let provincia = ""
    let ciudad = ""
    let arraDirect = ""
    if (latitud !== 0) {
        let arraDirect = await GetDirect(latitud, longitud)
        const status = arraDirect.status


        if (status === "OK") {
            const direccionComp = arraDirect.results[0].address_components

            direccionComp.forEach(element => {
                const type = element.types[0]
                if (type === "administrative_area_level_2") {
                    ciudad = element.short_name
                } else if (type === "administrative_area_level_1") {
                    provincia = element.short_name
                }
            });

            if (ciudad === "Capital") {
                ciudad = provincia
            }
            ciudad = ciudad.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            ciudad = ciudad.toUpperCase()
        }
    } else {
        arraDirect = {
            status: 501,
            error: "No hay coordenadas"
        }
    }

    if (!token) {
        try {
            result2 = await query({
                sql: sql2,
                timeout: 2000,
                values: [tipo, tipoDescr, latitud, longitud, 0, ip, provincia, ciudad, browser, device, typeDevice]
            })
        } finally {
        }
    } else {
        let decoded
        try {
            decoded = await jwt.verify(token, process.env.SECRET)
        } catch (error) {
            decoded = false
        }

        const facebook = decoded.facebook
        const valCons = decoded.ident

        if (!decoded) {
            try {
                result2 = await query({
                    sql: sql2,
                    timeout: 2000,
                    values: [tipo, tipoDescr, latitud, longitud, 0, ip, provincia, ciudad, browser, device, typeDevice]
                })
            } finally {
            }
        } else {
            if (facebook) {
                sql1 = ` SELECT id FROM usuarios WHERE facebook_id = ? `
            } else {
                sql1 = ` SELECT id FROM usuarios WHERE email = ? `
            }

            try {
                result1 = await query({
                    sql: sql1,
                    timeout: 2000,
                    values: [valCons]
                })
            } finally {
                idUsu = parseInt(result1[0].id)
                try {
                    result2 = await query({
                        sql: sql2,
                        timeout: 2000,
                        values: [tipo, tipoDescr, latitud, longitud, idUsu, ip, provincia, ciudad, browser, device, typeDevice]
                    })
                } finally {
                }
            }
        }
    }

    res.send(arraDirect)
})

module.exports = GetLocation
