const utf8 = require('utf8')
const QRCode = require('qrcode')
const base64 = require('base-64')

const CrearQR = (factData) => {
    const factDataStr = JSON.stringify(factData)
    var text = factDataStr
    var bytes = utf8.encode(text);
    var encoded = base64.encode(bytes);
    const paraAfip = "https://www.afip.gob.ar/fe/qr/?p=" + encoded

    QRCode.toDataURL(paraAfip, callback)
}

module.exports = CrearQR