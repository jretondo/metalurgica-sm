const express = require('express')
const ContactInfo = express()
const Consultador = require("../../../../database/Consultador")

ContactInfo.get("/test/contact-info", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT * FROM contact_principal`
    const sql2 = `SELECT * FROM contact_redes`
    const sql3 = `SELECT * FROM contact_tel`
    let result1
    let result2
    let result3

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
        })
    } finally {
        try {
            result2 = await query({
                sql: sql2,
                timeout: 2000,
            })
        } finally {
            try {
                result3 = await query({
                    sql: sql3,
                    timeout: 2000,
                })
            } finally {
                const email = result1[0].email
                const direccion = result1[0].direccion
                const localidad = result1[0].localidad
                const lat = result1[0].lat
                const lon = result1[0].long
                let redesSoc = []
                let telefonosContact = []
                let datosContact = []

                result2.map(redSoc => {
                    const idRed = redSoc.id
                    const redSocial = redSoc.red
                    const redStr = redSoc.red_str
                    const urlRed = redSoc.url

                    redesSoc.push({
                        "id": idRed,
                        "red": redSocial,
                        "redStr": redStr,
                        "url": urlRed
                    })
                })

                result3.map(telefono => {
                    const idTel = telefono.id
                    const tel = telefono.tel

                    telefonosContact.push({
                        "id": idTel,
                        "tel": tel
                    })
                })

                datosContact.push({
                    "telefono": telefonosContact,
                    "email": email,
                    "direccion": direccion,
                    "localidad": localidad,
                    "lat": lat,
                    "lon": lon,
                    "redes": redesSoc
                })

                resultado = {
                    status: 200,
                    result: datosContact
                }
                res.send(resultado)
            }
        }
    }
})

module.exports = ContactInfo