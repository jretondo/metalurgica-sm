const express = require('express')
const CambioEmail = express()
const jwt = require("jsonwebtoken")
const functSQLcond = require("../../../../database/functSQLcond")
const Comparar = require("../../../lib/Funciones/Comparador")
const Contestador = require("../../../../database/Contestador")

CambioEmail.post("/test/nvoEmail", async (req, res) => {
    const nvoEmail = req.body.nvoEmail
    const token = req.headers['x-access-token'];
    if (!token) {
        const respuesta = {
            status: 401,
            result: "",
            miJson: "No tiene los permisos para esta operación"
        }
        res.json(respuesta)
    } else {
        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            const email = decoded.email
            const facebook = decoded.facebook
            const pass = decoded.pass

            const envioTK = async (result) => {
                const passDB = result[0].pass
                const comprobar = await Comparar(pass, passDB)
                const id_usu = result[0].id

                if (comprobar) {
                    const sqlModEmail = `UPDATE usuarios SET email = ? WHERE id = ?`
                    Contestador(true, sqlModEmail, [nvoEmail, id_usu], res, process.env.NAME_DB_TEST, "")
                } else {
                    const respuesta = {
                        status: 401,
                        result: ""
                    }
                    res.send(respuesta);
                }
            }

            if (facebook === 0) {
                const sqlBuscarEmail = "SELECT id, pass FROM usuarios WHERE email = ? AND facebook = ?"
                functSQLcond(sqlBuscarEmail, [email, facebook], res, process.env.NAME_DB_TEST, envioTK)
            } else {
                const sqlBuscarEmail = "SELECT id, pass FROM usuarios WHERE email_face = ? AND facebook = ?"
                functSQLcond(sqlBuscarEmail, [email, facebook], res, process.env.NAME_DB_TEST, envioTK)
            }
        } catch (error) {
            const respuesta = {
                status: 401,
                resultado: 0
            }
            res.json(respuesta)
        }
    }

})

module.exports = CambioEmail