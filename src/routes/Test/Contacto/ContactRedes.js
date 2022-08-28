const express = require('express')
const ContactRedes = express()
const Consultador = require("../../../../database/Consultador")

ContactRedes.get("/test/contact-redes", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT * FROM contact_redes`

    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
        })
    } finally {
        let redesSoc = []
        result1.map(redSoc => {
            const idRed = redSoc.id
            const redStr = redSoc.red_str
            const urlRed = redSoc.url

            redesSoc.push({
                "id": idRed,
                "url": urlRed,
                "social": redStr
            })
        })

        resultado = {
            status: 200,
            result: redesSoc
        }
        res.send(resultado)
    }
})

module.exports = ContactRedes