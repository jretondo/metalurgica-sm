const express = require('express')
const ListaEmails = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")

ListaEmails.post('/test/ListaEmails', async (req, res) => {
    const token = req.headers["x-access-token"]
    const query = Consultador()
    const filtro = parseInt(req.body.filtro)
    const prov = req.body.prov
    const ciudad = req.body.ciudad
    let sql1
    let values1
    let result1
    let respuesta = []
    const isSecure = await SecureVerify(token)

    if (filtro === 1) {
        sql1 = ` SELECT email FROM suscripciones UNION SELECT email FROM usuarios WHERE email <> '' `
        values1 = []
    } else if (filtro === 2) {
        sql1 = ` SELECT email FROM usuarios WHERE email <> '' `
        values1 = []
    } else if (filtro === 3) {
        sql1 = ` SELECT email FROM suscripciones WHERE email <> '' `
        values1 = []
    } else if (filtro === 0) {
        sql1 = ` SELECT email FROM usuarios WHERE provincia = ? AND email <> '' `
        values1 = [prov]
    } else {
        sql1 = ` SELECT email FROM usuarios WHERE provincia = ? AND ciudad = ? AND email <> '' `
        values1 = [prov, ciudad]
    }

    if (isSecure) {
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
                respuesta = {
                    status: 200,
                    result: result1
                }
                res.send(respuesta)
            } else {
                respuesta = {
                    status: 500,
                    error: "No hay casillas!"
                }
                res.send(respuesta)
            }
        }
    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }
})

module.exports = ListaEmails