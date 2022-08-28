const express = require('express')
const AutoLogin = express()
const jwt = require("jsonwebtoken")
const functSQLcond = require("../../../../database/functSQLcond")
const Comparar = require("../../../lib/Funciones/Comparador")

AutoLogin.get("/test/autologin", async (req, res) => {

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
                const nombre = result[0].nombre_compl
                const avatar = result[0].url_avatar
                const id_usu = result[0].id
                const facebook = result[0].facebook
                const email = result[0].email
                const datosusu = {
                    nombre: nombre,
                    avatar: avatar,
                    id_usu: id_usu,
                    facebook: facebook,
                    email: email
                }
                if (comprobar) {
                    const respuesta = {
                        status: 200,
                        resultado: datosusu
                    }
                    res.json(respuesta)
                } else {
                    const respuesta = {
                        status: 401,
                        resultado: 0
                    }
                    res.json(respuesta)
                }
            }
            if (facebook === 0) {
                const sqlBuscarEmail = "SELECT id, pass, nombre_compl, url_avatar, facebook, email FROM usuarios WHERE email = ? AND facebook = ?"
                functSQLcond(sqlBuscarEmail, [email, facebook], res, process.env.NAME_DB_TEST, envioTK)
            } else {
                const sqlBuscarEmail = "SELECT id, pass, nombre_compl, url_avatar, facebook, email FROM usuarios WHERE email_face = ? AND facebook = ?"
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

module.exports = AutoLogin