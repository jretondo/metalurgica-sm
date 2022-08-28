const express = require('express')
const PrevEmailCupon = express()
const SecureVerify = require("../../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../../database/Consultador")
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../../../Global/Colors.json')
const Links = require('../../../../Global/Links.json')
const Names = require('../../../../Global/Names.json')
const NumberFormat = require("../../../../lib/Funciones/NumberFormat")

PrevEmailCupon.post('/test/PrevEmailCupon', async (req, res) => {
    const token = req.headers["x-access-token"]
    const query = Consultador()
    const prevText = req.body.prevText
    const cupon = req.body.cupon
    const isSecure = await SecureVerify(token)
    const sql1 = ` SELECT * FROM cupones_tb WHERE cupon = ? `
    let result1

    if (isSecure) {
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [cupon]
            })
        } finally {
            let cant
            try {
                cant = parseInt(result1.length)
            } catch (error) {
                cant = 0
            }
            if (cant > 0) {
                let txtFoother
                const tipo = parseInt(result1[0].desc_tipo)
                const porcentaje = parseInt(result1[0].porc)
                const montoDesc = NumberFormat(result1[0].monto_dec)
                const descMax = NumberFormat(result1[0].desc_max)
                const montoMin = NumberFormat(result1[0].monto_min)

                if (tipo === 0) {
                    txtFoother = `
                    <span> * El descuento es por $${montoDesc}. El mìnimo de compra para útilizar el cupón es de $${montoMin}</span>
                    `
                } else {
                    txtFoother = `
                    <span> * El descuento es por el ${porcentaje}% de la compra. El mìnimo de compra para útilizar el cupón es de $${montoMin} y el tope de descuento es de $${descMax}</span>
                    `
                }

                const parrafosHead = [
                    prevText
                ]

                const datos2 = {
                    Colors,
                    Links,
                    Names,
                    //Particular
                    //Head
                    titlePage: "Nuevo Cupón",
                    titleHead: "Buenos días!",
                    parrafosHead: parrafosHead,

                    //ActionBtn
                    titleButton: "A continuación le pasamos un cupón de descuento para que útilice en nuestra web:",
                    textCall: cupon,
                    textFoother: `Ingrese el cupón en la sección de carrito de compra en nuestra web: <br> <a href='https://cordobabaitcast.com.ar/cart' target='_blank'>Córdoba Baitcast Web - Carrito de compra</a>
                    <br />
                    <br />
                    ${txtFoother}
                    `
                }

                ejs.renderFile(path.join("views", "registrado.ejs"), function (err, data) {

                    res.render('Emails/Templates/ForgotPass.ejs', datos2);

                });
            } else {
                res.send("Error en el formato o no hay cupñon seleccionado")
            }
        }
    } else {
        res.send("Error en el formato o no hay cupñon seleccionado")
    }

})

module.exports = PrevEmailCupon