const path = require("path")
const Afip = require('@afipsdk/afip.js')

const CrearFactura = async (dni, impTotal, notaCred, cbteAsoc) => {
    const resFolder = path.join("src", "lib", "Afip", "crt")
    //const crtFile = "201859993363test.crt"
    const crtFile = "201859993363.crt"
    const keyFile = "201859993363.key"
    const ticketFolder = path.join("src", "lib", "Afip", "token")
    let data
    const afip = new Afip({
        CUIT: 20185999336,
        res_folder: resFolder,
        cert: crtFile,
        key: keyFile,
        ta_folder: ticketFolder,
        production: true
    })

    const statusAFIP = await afip.ElectronicBilling.getServerStatus()
    const appStatus = statusAFIP.AppServer
    const bdServer = statusAFIP.DbServer
    const authServer = statusAFIP.AuthServer

    let erroAfip = false
    if (appStatus !== "OK") {
        erroAfip = true
    } else if (bdServer !== "OK") {
        erroAfip = true
    } else if (authServer !== "OK") {
        erroAfip = true
    }

    if (erroAfip === true) {
        return false
    } else {

        let tcomp

        if (notaCred) {
            tcomp = 13
        } else {
            tcomp = 11
        }
        console.log(`aca2`)
        try {
            let lastVoucher = await afip.ElectronicBilling.getLastVoucher(3, tcomp)
            console.log(`aca3`)
            const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            console.log(`aca4`)
            if (notaCred) {
                data = {
                    'CantReg': 1,
                    'PtoVta': 3,
                    'CbteTipo': 13,
                    'Concepto': 1,
                    'DocTipo': 96,
                    'DocNro': dni,
                    'CbteDesde': parseInt(lastVoucher + 1),
                    'CbteHasta': parseInt(lastVoucher + 1),
                    'CbteFch': parseInt(date.replace(/-/g, '')),
                    'ImpTotal': impTotal,
                    'ImpTotConc': 0,
                    'ImpNeto': impTotal,
                    'ImpOpEx': 0,
                    'ImpIVA': 0,
                    'ImpTrib': 0,
                    'MonId': 'PES',
                    'MonCotiz': 1,
                    'CbtesAsoc': [
                        {
                            'Tipo': 11,
                            'PtoVta': 3,
                            'Nro': cbteAsoc,
                            'Cuit': 20185999336
                        }
                    ],
                };
            } else {
                data = {
                    'CantReg': 1,
                    'PtoVta': 3,
                    'CbteTipo': 11,
                    'Concepto': 1,
                    'DocTipo': 96,
                    'DocNro': dni,
                    'CbteDesde': parseInt(lastVoucher + 1),
                    'CbteHasta': parseInt(lastVoucher + 1),
                    'CbteFch': parseInt(date.replace(/-/g, '')),
                    'ImpTotal': impTotal,
                    'ImpTotConc': 0,
                    'ImpNeto': impTotal,
                    'ImpOpEx': 0,
                    'ImpIVA': 0,
                    'ImpTrib': 0,
                    'MonId': 'PES',
                    'MonCotiz': 1,
                };
            }

            const res = await afip.ElectronicBilling.createVoucher(data);
            const nroCae = res['CAE'];
            const vtoCae = res['CAEFchVto'];

            return {
                nroCae,
                vtoCae,
                date,
                pv: 3,
                cbte: parseInt(lastVoucher + 1)
            }
        } catch (error) {
            console.log(`error`, error)
            return false
        }

    }
}

module.exports = CrearFactura