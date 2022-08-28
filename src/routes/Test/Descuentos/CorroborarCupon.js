const express = require('express')
const CorroboraCupon = express()
const Consultador = require("../../../../database/Consultador")
const jwt = require("jsonwebtoken")

CorroboraCupon.get('/test/corroboraCupon/:cupon', async (req, res) => {
    const query = Consultador()
    const token = req.headers['x-access-token']
    const cupon = req.params.cupon
    let sql1
    const sql2 = ` SELECT COUNT(*) as cantidad FROM products_delivered WHERE user_id = ? AND cupon = ? `
    let result1
    let result2
    let respuesta = []
    let decoded
    try {
        decoded = await jwt.verify(token, process.env.SECRET)
    } catch (error) {
        decoded = false
    }

    const facebook = decoded.facebook
    const valCons = decoded.ident

    if (facebook) {
        sql1 = `SELECT id FROM usuarios WHERE facebook_id = ?`
    } else {
        sql1 = `SELECT id FROM usuarios WHERE email = ?`
    }

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [valCons]
        })
    } finally {
        let idUsu
        try {
            idUsu = parseInt(result1[0].id)
            try {
                result2 = await query({
                    sql: sql2,
                    timeout: 2000,
                    values: [idUsu, cupon]
                })
            } finally {
                let cant
                try {
                    cant = parseInt(result2[0].cantidad)
                } catch (error) {
                    cant = 0
                }
                if (cant > 0) {
                    respuesta = {
                        status: 501,
                        error: "Cupón ya utilizado!"
                    }

                    res.send(respuesta)
                } else {
                    respuesta = {
                        status: 200,
                        result: ""
                    }

                    res.send(respuesta)
                }
            }
        } catch (error) {
            respuesta = {
                status: 500,
                error: "Usuario no encontrado!"
            }

            res.send(respuesta)
        }
    }
})

module.exports = CorroboraCupon