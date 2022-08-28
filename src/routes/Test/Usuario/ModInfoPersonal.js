const express = require('express')
const ModInfoPersonal = express()
const Consultador = require("../../../../database/Consultador")
const jwt = require("jsonwebtoken")

ModInfoPersonal.post('/test/ModInfoPersonalUsu', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const cookie = request.cookie
    const nombre = request.nombre
    const apellido = request.apellido
    const email = request.email
    const codArea = request.codArea
    const telefono = request.telefono

    let result = []

    if (!cookie) {
        respuesta = {
            status: 401,
            result: "",
            error: "No tiene los permisos para esta operación"
        }
        res.json(respuesta)
    } else {
        let decoded
        try {
            decoded = await jwt.verify(cookie, process.env.SECRET)
        } catch (error) {
            console.log(`error`, error)
            decoded = false
        }

        const facebook = decoded.facebook
        const valCons = decoded.ident

        console.log(`valCons`, valCons)
        console.log(`facebook`, facebook)

        let sql

        if (facebook) {
            sql = `UPDATE usuarios SET email_face = ?, nombre = ?,  apellido = ?, cod_area = ?, telefono = ? WHERE facebook_id = ?`
        } else {
            sql = `UPDATE usuarios SET email_face = ?, nombre = ?,  apellido = ?, cod_area = ?, telefono = ? WHERE email = ?`
        }

        try {
            result = await query({
                sql: sql,
                timeout: 2000,
                values: [email, nombre, apellido, codArea, telefono, valCons]
            })
        } finally {
            const rowsAff1 = parseInt(result.affectedRows)

            if (rowsAff1 > 0) {
                respuesta = {
                    status: 200,
                    result: "Modificado con éxito!"
                }
                res.send(respuesta);
            } else {
                respuesta = {
                    status: 401,
                    result: "",
                    error: "Hubo un error al querer modificar los datos"
                }
                res.json(respuesta)
            }
        }
    }
})

module.exports = ModInfoPersonal