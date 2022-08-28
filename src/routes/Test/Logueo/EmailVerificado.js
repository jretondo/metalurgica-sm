const express = require('express')
const EmailVerificado = express()
const functSQLcond = require("../../../../database/functSQLcond")

EmailVerificado.get("/test/confimAccount/:token", async (req, res) => {

    const request = req.params
    const token = request.token
    const sqlVerifEmail = "UPDATE usuarios SET confirmado = '1' WHERE confirmado = ?;"

    function Redireccionar(result) {

        const affected = parseInt(result.affectedRows)
        if (affected > 0) {
            res.render('registrado', { title: 'First Web Node' });
        } else {
            res.render('noRegistrado', { title: 'First Web Node' });
        }
    }

    functSQLcond(sqlVerifEmail, [token], res, process.env.NAME_DB_TEST, Redireccionar)
})

module.exports = EmailVerificado