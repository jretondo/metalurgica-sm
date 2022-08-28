const ejs = require("ejs")
const path = require('path')
const pdf = require("html-pdf")
const base64 = require('base-64')
const utf8 = require('utf8')
const QRCode = require('qrcode')
const fs = require("fs")

const CrearFactPDF = async (myCss, factData, logo, logoAfip1, logoAfip2, fechaFactStr, clienteName, clienteNro, clienteDireccion, clienteEmail, subTotal, costoEnvio, totalFact, caeNro, caeVto, listaItems, pvStr, nroCbteStr, res, facturaData, notaCred, cbteRel, cuponDesc, cuponDescStr) => {
    let cuponBool = false

    if (cuponDesc > 0) {
        cuponBool = true
    }

    let respuesta = []

    function base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer.from(bitmap).toString('base64');
    }

    const factDataStr = JSON.stringify(factData)
    var text = factDataStr
    var bytes = utf8.encode(text);
    var encoded = base64.encode(bytes);
    const paraAfip = "https://www.afip.gob.ar/fe/qr/?p=" + encoded
    let logo64 = base64_encode(path.join("Img", "logo.png"))
    let lAfip1 = base64_encode(path.join("Img", "AFIP1.png"))
    let lAfip2 = base64_encode(path.join("Img", "AFIP2.png"))
    let ubicacionHtml
    let letra

    if (notaCred) {
        ubicacionHtml = path.join("views", "Factura", "NotaCred.ejs")
        letra = "NC"
    } else {
        ubicacionHtml = path.join("views", "Factura", "Factura.ejs")
        letra = "C"
    }
    QRCode.toDataURL(paraAfip, function (err, url) {
        if (err) {
            respuesta = {
                status: 301,
                error: err
            }
            const resultado = {
                facturaData,
                respuesta,
                status: 301
            }
            res.send(resultado);
        } else {
            ejs.renderFile(ubicacionHtml, {
                myCss: myCss,
                logo: 'data:image/png;base64,' + logo64,
                logoAfip1: 'data:image/png;base64,' + lAfip1,
                logoAfip2: 'data:image/png;base64,' + lAfip2,
                codQR: url,
                factNro: pvStr + "-" + nroCbteStr,
                fechaFact: fechaFactStr,
                clienteDireccion: clienteDireccion,
                clienteEmail: clienteEmail,
                clienteName: clienteName,
                clienteNro: clienteNro,
                subTotal: subTotal,
                costoEnvio: costoEnvio,
                totalFact: totalFact,
                caeNro: caeNro,
                caeVto: caeVto,
                listaItems: listaItems,
                cbteAsoc: cbteRel,
                cupon: cuponBool,
                descCupon: cuponDescStr
            }, function (err, data) {
                if (err) {
                    respuesta = {
                        status: 301,
                        error: err
                    }
                    const resultado = {
                        facturaData,
                        respuesta,
                        status: 301
                    }
                    res.send(resultado);
                } else {
                    let options = {
                        "height": "16.5in",        // allowed units: mm, cm, in, px
                        "width": "12in",            // 
                        "border": {
                            "right": "0.5cm",
                            "left": "0.5cm"
                        },
                    };

                    pdf.create(data, options).toFile(path.join("Public", "Facturas", letra + " " + pvStr + "-" + nroCbteStr + ".pdf"), async function (err, data) {
                        if (err) {

                            respuesta = {
                                status: 301,
                                error: err
                            }
                            const resultado = {
                                facturaData,
                                respuesta,
                                status: 301
                            }
                            res.send(resultado);
                        } else {
                            respuesta = {
                                status: 200,
                                result: letra + " " + pvStr + "-" + nroCbteStr + ".pdf"
                            }
                            const resultado = {
                                facturaData,
                                respuesta,
                                status: 200
                            }
                            res.send(resultado);
                        }
                    });
                }
            });
        }
    })
}

module.exports = CrearFactPDF