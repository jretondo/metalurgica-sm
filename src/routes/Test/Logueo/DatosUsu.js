const express = require('express')
const DatosUsu = express()
const jwt = require("jsonwebtoken")
const Contestador = require("../../../../database/Contestador")

DatosUsu.post("/test/datosUsu", async (req, res) => {

    const request = req.body
    const email = request.email
    const token = req.headers['x-access-token'];
    if (!token) {
        const respuesta = {
            status: 401,
            result: "",
            miJson: "No tiene los permisos para esta operación"
        }
        res.json(respuesta)
    } else {
        const decoded = await jwt.verify(token, process.env.SECRET);
        const email2 = decoded.email
        const facebook = decoded.facebook

        if (email === email2) {
            const sqlBuscarEmail = "SELECT nombre_compl, url_avatar, fecha_bloc, fecha_registro, ult_ingreso FROM usuarios WHERE email = ? AND facebook = ?"
            Contestador(true, sqlBuscarEmail, [email, facebook], res, process.env.NAME_DB_TEST, "")
        } else {
            const respuesta = {
                status: 401,
                result: "",
                miJson: "No tiene los permisos para esta operación"
            }
            res.json(respuesta)
        }
    }

})

module.exports = DatosUsu