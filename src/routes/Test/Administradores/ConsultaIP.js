const express = require('express')
const ConsultaIP = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../database/Consultador")
const DatosUsu = require('../../../lib/Funciones/DatosUsu')

ConsultaIP.get('/test/ConsultaIP/:id', async (req, res) => {
    const query = Consultador()
    const token = req.headers['x-access-token']
    const isSecure = await SecureVerify(token)
    const idVisit = req.params.id
    const sql1 = ` SELECT * FROM actividad_usu WHERE id = ? `
    let usuBool = false
    let directBool = false
    let result1
    let resultado = []
    let respuesta = []

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [idVisit]
            })
        } finally {
            let cant
            try {
                cant = parseInt(result1.length)
            } catch (error) {
                cant = 0
            }
            if (cant > 0) {
                const horario = result1[0].momento
                const accion = result1[0].descr_tipo
                const navegador = result1[0].navegador
                const tipoDisp = result1[0].dispositivo_tipo
                let dispositivo = result1[0].dispositivo
                let dispCompl
                if (tipoDisp === "desktop") {
                    dispCompl = "Escritorio OS(" + dispositivo + ")"
                } else {
                    dispCompl = "Celular (" + dispositivo + ")"
                }
                const idUsu = parseInt(result1[0].id_usu)
                let datosUsu = []
                let nombreCompl = ""
                let email = ""
                if (idUsu > 0) {
                    datosUsu = await DatosUsu(idUsu)
                    nombreCompl = datosUsu[0].nombre + " " + datosUsu[0].nombre
                    email = datosUsu[0].email_face
                    usuBool = true
                }
                const latitud = result1[0].latitud
                const latitud0 = parseInt(result1[0].latitud)
                const longitud = result1[0].longitud
                if (latitud0 !== 0) {
                    directBool = true
                }

                resultado = {
                    horario,
                    accion,
                    navegador,
                    dispCompl,
                    nombreCompl,
                    email,
                    usuBool,
                    directBool,
                    latitud,
                    longitud
                }

                respuesta = {
                    status: 200,
                    result: resultado
                }
                res.send(respuesta)
            } else {
                respuesta = {
                    status: 501,
                    error: "No hay datos!"
                }
                res.send(respuesta)
            }
        }
    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }
})

module.exports = ConsultaIP