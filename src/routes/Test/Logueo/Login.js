const express = require('express')
const Login = express()
const jwt = require("jsonwebtoken")
const functSQLcond = require("../../../../database/functSQLcond")
const Comparar = require("../../../lib/Funciones/Comparador")
var FormatDate = require("../../../lib/Funciones/FormatDate")

Login.post("/test/login", async (req, res) => {

    const request = req.body
    const email = request.email
    const pass = request.pass
    const facebook = request.facebook
    const cookie = jwt.sign({ email: email, facebook: facebook, pass: pass }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24
    })
    const envioTK = async (result) => {
        const passDB = result[0].pass
        const confirmado = parseInt(result[0].confirmado)
        const provisoria = parseInt(result[0].provisoria)

        const comprobar = await Comparar(pass, passDB)
        if (comprobar) {
            if (facebook === 0) {
                if (confirmado !== 1) {
                    const respuesta = {
                        status: 202,
                        resultado: 0
                    }
                    res.json(respuesta)
                } else if (provisoria === 1) {
                    const respuesta = {
                        status: 203,
                        resultado: 0
                    }
                    res.json(respuesta)
                } else {

                    const nuevoIng = async (result2) => {
                        const respuesta = {
                            status: 200,
                            resultado: cookie
                        }
                        res.json(respuesta)
                    }
                    const fecha_reg = new Date()
                    const fechaNvoIngr = FormatDate(fecha_reg, "yyyy-mm-dd hor:min:seg")
                    const sqlNvoIng = `UPDATE usuarios SET ult_ingreso = ? WHERE email = ?`
                    functSQLcond(sqlNvoIng, [fechaNvoIngr, email], res, process.env.NAME_DB_TEST, nuevoIng)
                }
            } else {
                const nuevoIng = async (result2) => {
                    const respuesta = {
                        status: 200,
                        resultado: cookie
                    }
                    res.json(respuesta)
                }
                const fecha_reg = new Date()
                const fechaNvoIngr = FormatDate(fecha_reg, "yyyy-mm-dd hor:min:seg")
                const sqlNvoIng = `UPDATE usuarios SET ult_ingreso = ? WHERE email = ?`
                functSQLcond(sqlNvoIng, [fechaNvoIngr, email], res, process.env.NAME_DB_TEST, nuevoIng)
            }
        } else {
            const respuesta = {
                status: 401,
                resultado: 0
            }
            res.json(respuesta)
        }
    }
    if (facebook === 0) {
        const sqlBuscarEmail = "SELECT pass, confirmado, provisoria FROM usuarios WHERE email = ? AND facebook = ?"
        functSQLcond(sqlBuscarEmail, [email, facebook], res, process.env.NAME_DB_TEST, envioTK)
    } else {
        const sqlBuscarEmail = "SELECT pass, confirmado, provisoria FROM usuarios WHERE email_face = ? AND facebook = ?"
        functSQLcond(sqlBuscarEmail, [email, facebook], res, process.env.NAME_DB_TEST, envioTK)
    }


})

module.exports = Login