const express = require('express')
const CambiarPassUsu = express()
const Encriptar = require('../../../lib/Funciones/Encriptador')
const Consultador = require("../../../../database/Consultador")
const jwt = require("jsonwebtoken")

CambiarPassUsu.post('/test/CambioPassUsu', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const token = req.headers['x-access-token']
    const pass = request.pass
    const tokenPass = await Encriptar(pass)
    console.log(`pass`, pass)
    console.log(`token`, token)
    let sql1
    const sql2 = `UPDATE usuarios SET pass = ?, provisoria = 0 WHERE id = ?`
    let result1
    let result2

    let respuesta

    if (!token) {
        respuesta = {
            status: 401,
            result: "",
            error: "No tiene los permisos para esta operación"
        }
        res.json(respuesta)
    } else {
        let decoded
        try {
            decoded = await jwt.verify(token, process.env.SECRET)
        } catch (error) {
            decoded = false
        }

        const facebook = decoded.facebook
        const valCons = decoded.ident
        console.log(`valCOns`, valCons)
        if (facebook) {
            sql1 = `SELECT id, nombre, apellido FROM usuarios WHERE facebook_id = ?`
        } else {
            sql1 = `SELECT id, nombre, apellido FROM usuarios WHERE email = ?`
        }
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [valCons]
            })
        } finally {
            console.log(`result1`, result1)
            const cant = parseInt(result1.length)


            if (cant > 0) {
                const idUsu = result1[0].id
                const nombre = result1[0].nombre
                const apellido = result1[0].apellido
                const nomCompleto = nombre + " " + apellido
                try {
                    result2 = await query({
                        sql: sql2,
                        timeout: 2000,
                        values: [tokenPass, idUsu]
                    })
                } finally {
                    const rowsAff1 = parseInt(result2.affectedRows)
                    if (rowsAff1 > 0) {
                        const cookie = jwt.sign({ ident: valCons, facebook: 0, pass: pass, nombre: nomCompleto }, process.env.SECRET, {
                            expiresIn: 60 * 60 * 24
                        })
                        respuesta = {
                            status: 200,
                            result: cookie
                        }
                        res.send(respuesta);
                    } else {
                        respuesta = {
                            status: 500,
                            error: "Error inesperado"
                        }
                        res.send(respuesta);
                    }
                }
            } else {
                respuesta = {
                    status: 500,
                    error: "Error inesperado"
                }
                res.send(respuesta);
            }
        }
    }
})

module.exports = CambiarPassUsu