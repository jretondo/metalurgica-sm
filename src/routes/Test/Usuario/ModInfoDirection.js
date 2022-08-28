const express = require('express')
const ModInfoDirection = express()
const Consultador = require("../../../../database/Consultador")
const jwt = require("jsonwebtoken")

ModInfoDirection.post('/test/ModInfoDirection', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const cookie = request.cookie
    const provincia = request.provincia
    const ciudad = request.ciudad
    const direccion1 = request.direccion1
    const direccion2 = request.direccion2
    const codPost = request.codPost
    const infoAdd = request.infoAdd
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
            sql = `UPDATE usuarios SET provincia = ?, ciudad = ?, direccion1 = ?, direccion2 = ?, cp = ?, info_adicional = ? WHERE facebook_id = ?`
        } else {
            sql = `UPDATE usuarios SET provincia = ?, ciudad = ?, direccion1 = ?, direccion2 = ?, cp = ?, info_adicional = ? WHERE email = ?`
        }

        try {
            result = await query({
                sql: sql,
                timeout: 2000,
                values: [provincia, ciudad, direccion1, direccion2, codPost, infoAdd, valCons]
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

module.exports = ModInfoDirection