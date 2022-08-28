const express = require('express')
const BorrarUsu = express()

BorrarUsu.post('/test/borrar_usu', (req, res) => {
    const respuesta = {
        status: 200,
        result: "Alguna info de borra usu"
    }

    res.send(respuesta);
})

module.exports = BorrarUsu