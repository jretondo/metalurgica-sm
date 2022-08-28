const express = require('express')
const ConfirmEmail = express()
const Consultador = require("../../../../database/Consultador")

ConfirmEmail.get('/test/ConfirmEmail/:token', async (req, res) => {
    const query = Consultador()
    const token = req.params.token
    const sqlVerifEmail = "UPDATE usuarios SET confirmado = '1', token = '0' WHERE token = ?"
    let result1

    try {
        result1 = await query({
            sql: sqlVerifEmail,
            timeout: 2000,
            values: [token]
        })
    } finally {
        const rowsAff1 = parseInt(result1.affectedRows)

        if (rowsAff1 > 0) {
            res.render('Pages/registrado.ejs');
        } else {
            res.render('Pages/noRegistrado.ejs');
        }
    }
})

module.exports = ConfirmEmail