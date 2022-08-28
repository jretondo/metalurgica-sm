const express = require('express')
const AutoLogin = express()
const jwt = require("jsonwebtoken")
const Comparar = require("../../../lib/Funciones/Comparador")
const Consultador = require("../../../../database/Consultador")

AutoLogin.get('/test/autologin', async (req, res) => {
    const query = Consultador()
    const token = req.headers['x-access-token']
    let sql1
    let result1
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
        const valComparador = decoded.pass

        if (facebook) {
            sql1 = `SELECT token as valor, nombre, apellido, url_avatar, email_face, provincia, ciudad, direccion1, direccion2, cp, cod_area, telefono, info_adicional FROM usuarios WHERE facebook_id = ?`
        } else {
            sql1 = `SELECT pass as valor, nombre, apellido, url_avatar, email_face, provincia, ciudad, direccion1, direccion2, cp, cod_area, telefono, info_adicional FROM usuarios WHERE email = ?`
        }
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [valCons]
            })
        } finally {
            const cantidad = parseInt(result1.length)
            if (cantidad > 0) {
                const token = result1[0].valor
                const imagenAvatar = result1[0].url_avatar
                const nombre = result1[0].nombre
                let casillaEmail = result1[0].email_face
                let apellido = result1[0].apellido
                let provincia = result1[0].provincia
                let ciudad = result1[0].ciudad
                let direccion1 = result1[0].direccion1
                let direccion2 = result1[0].direccion2
                let codPost = result1[0].cp
                let codArea = result1[0].cod_area
                let telefono = result1[0].telefono
                let infoAdd = result1[0].info_adicional

                if (apellido === null) {
                    apellido = ""
                }
                if (casillaEmail === null) {
                    casillaEmail = ""
                }
                if (provincia === null) {
                    provincia = ""
                    ciudad = ""
                }

                if (direccion1 === null) {
                    direccion1 = ""
                }

                if (direccion2 === null) {
                    direccion2 = ""
                }

                if (codPost === null) {
                    codPost = ""
                }

                if (codArea === null) {
                    codArea = ""
                }

                if (telefono === null) {
                    telefono = ""
                }

                if (infoAdd === null) {
                    infoAdd = ""
                }

                const comprobar = await Comparar(valComparador, token)

                if (comprobar) {
                    const nomCompleto = nombre + " " + apellido
                    const cookie = jwt.sign({ ident: valCons, facebook: facebook, pass: valComparador, nombre: nomCompleto }, process.env.SECRET, {
                        expiresIn: 60 * 60 * 24 * 7
                    })

                    resultado = {
                        nombre: nombre,
                        apellido: apellido,
                        imagen: imagenAvatar,
                        casillaEmail: casillaEmail,
                        provincia: provincia,
                        ciudad: ciudad,
                        direccion1: direccion1,
                        direccion2: direccion2,
                        codPost: codPost,
                        codArea, codArea,
                        telefono: telefono,
                        infoAdd: infoAdd,
                        cookie: cookie
                    }
                    respuesta = {
                        status: 200,
                        result: resultado
                    }
                    res.send(respuesta);
                } else {
                    respuesta = {
                        status: 403,
                        result: "",
                        error: "Contraseña incorrecta!"
                    }
                    res.send(respuesta);
                }
            } else {
                respuesta = {
                    status: 401,
                    result: "",
                    error: "No se encuentra el usuario!"
                }
                res.send(respuesta);
            }
        }
    }
})

module.exports = AutoLogin