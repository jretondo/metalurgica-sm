const express = require('express')
const IniSesion = express()
const Comparar = require('../../../lib/Funciones/Comparador')
const Consultador = require("../../../../database/Consultador")
const jwt = require("jsonwebtoken")

IniSesion.post('/test/inisesion', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const email = request.email
    const pass = request.pass
    const idFace = request.idFace
    const faceBool = request.faceBool

    let sql1
    let result1
    let valCons
    let valComparador
    let respuesta
    let resultado

    if (faceBool) {
        sql1 = `SELECT token as valor, nombre, apellido, url_avatar, email_face, provincia, ciudad, direccion1, direccion2, cp, cod_area, telefono, info_adicional, provisoria FROM usuarios WHERE facebook_id = ?`
        valCons = idFace
        valComparador = idFace
    } else {
        sql1 = `SELECT pass as valor, nombre, apellido, url_avatar, email_face, provincia, ciudad, direccion1, direccion2, cp, cod_area, telefono, info_adicional, provisoria, confirmado FROM usuarios WHERE email = ?`
        valCons = email
        valComparador = pass
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
            let confirmado = 1
            if (!faceBool) {
                confirmado = parseInt(result1[0].confirmado)
            }
            const token = result1[0].valor
            const nombre = result1[0].nombre
            let apellido = result1[0].apellido
            let casillaEmail = result1[0].email_face
            const nomCompleto = nombre + " " + apellido
            const avatarImg = result1[0].url_avatar
            const comprobar = await Comparar(valComparador, token)
            const provisoria = parseInt(result1[0].provisoria)
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

            if (comprobar) {
                const cookie = jwt.sign({ ident: valCons, facebook: faceBool, pass: valComparador, nombre: nomCompleto }, process.env.SECRET, {
                    expiresIn: 60 * 60 * 24 * 7
                })

                resultado = {
                    cookie: cookie,
                    nombre: nombre,
                    apellido: apellido,
                    imagen: avatarImg,
                    casillaEmail: casillaEmail,
                    provincia: provincia,
                    ciudad: ciudad,
                    direccion1: direccion1,
                    direccion2: direccion2,
                    codPost: codPost,
                    codArea, codArea,
                    telefono: telefono,
                    infoAdd: infoAdd,
                    provisoria: provisoria
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
})

module.exports = IniSesion