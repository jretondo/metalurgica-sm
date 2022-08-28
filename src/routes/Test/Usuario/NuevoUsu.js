const express = require('express')
const NvoUsu = express()
const SendEmail = require("../../../lib/Emails/SendEmail")
const Encriptar = require('../../../lib/Funciones/Encriptador')
const pathimagenes = require("../../Test/Global/UrlImg")
const ejs = require("ejs")
const path = require('path')
const Consultador = require("../../../../database/Consultador")
const FormatDate = require("../../../lib/Funciones/FormatDate")
const Colors = require('../../../Global/Colors.json')
const Links = require('../../../Global/Links.json')
const Names = require('../../../Global/Names.json')
const fs = require('fs')
const https = require('https')

NvoUsu.post('/test/nvousuario', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const email = request.email
    const nombre = request.nombre
    const apellido = request.apellido
    const facebookId = request.facebookId
    const pass = request.pass
    const emailFace = request.emailFace
    const facebookbool = request.facebookbool
    const imgAvatarLink = request.imgAvatarLink

    console.log('req.body :>> ', req.body)

    let carpeta = await pathimagenes("avatares/")
    let tokenPass = ""
    let emailToken = ""
    let facebookIdToken = ""
    let avatarUrl = ""

    function saveImageToDisk(url, localPath) {
        var fullUrl = url;
        var file = fs.createWriteStream(localPath);
        var request = https.get(url, function (response) {
            response.pipe(file);
        });
    }
    if (!facebookbool) {
        let prueba = "gfmeagñ/adghsdghsd/654654gg/gaeg/gdas/g//g//gdg/g//dg/dg/dgsd/gg///g/dg"

        prueba = prueba.replace(/[.*+?^${}()|[\]\\]/g, "5")
        prueba = prueba.replace(/[[/]]/g, "5")
        prueba = await prueba.split("/").join("5")
        tokenPass = await Encriptar(pass)
        emailToken = await Encriptar(email)
        emailToken = emailToken.replace(/[.*+?^${}()|[\]\\]/g, "5")
        emailToken = emailToken.replace(/[[/]]/g, "5")
        emailToken = await emailToken.split("/").join("5")
        avatarUrl = "https://nekonet.com.ar/logosClientes/firma/foto2.png"
    } else {
        facebookIdToken = await Encriptar(facebookId)
        avatarUrl = carpeta + facebookId + ".jpg"
        const ubicacion = path.join(__dirname, "..", "..", "..", "..", "Public", "Imagenes", "avatares", facebookId + ".jpg")
        saveImageToDisk(imgAvatarLink, ubicacion)
    }

    let puerto
    if (process.env.ENTORNO === "WINDOWS") {
        puerto = 3005
    } else {
        puerto = 3006
    }
    let sql0
    let valueCons
    let token
    let sql1

    if (facebookbool) {
        sql0 = `SELECT COUNT(*) AS cant FROM usuarios WHERE facebook_id = ?`
        sql1 = `INSERT INTO usuarios (email, nombre, apellido,facebook_id, pass, token, email_face, url_avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        valueCons = facebookId
        token = facebookIdToken
    } else {
        sql0 = `SELECT COUNT(*) AS cant FROM usuarios WHERE email = ?`
        sql1 = `INSERT INTO usuarios (email, nombre, apellido,facebook_id, pass, token, email_face, url_avatar, confirmado ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`
        valueCons = email
        token = emailToken
    }

    let result0
    let result1
    let respuesta

    try {
        result0 = await query({
            sql: sql0,
            timeout: 2000,
            values: [valueCons]
        })
    } finally {
        const cantidad = result0[0].cant
        if (cantidad > 0) {
            respuesta = {
                status: 201,
                error: "Ya se encuentra registrado!"
            }
            res.send(respuesta);
        } else {

            try {
                result1 = await query({
                    sql: sql1,
                    timeout: 2000,
                    values: [email, nombre, apellido, facebookId, tokenPass, token, emailFace, avatarUrl]
                })
            } finally {

                let rowsAff1
                try {
                    rowsAff1 = parseInt(result1.affectedRows)
                } catch (error) {
                    rowsAff1 = 0
                }


                if (rowsAff1 > 0) {
                    respuesta = {
                        status: 200,
                        error: "Registrado con éxito!"
                    }
                    res.send(respuesta);
                } else {
                    respuesta = {
                        status: 401,
                        error: "Email no envíado!"
                    }
                    res.send(respuesta);
                }
            }
        }
    }

})

module.exports = NvoUsu