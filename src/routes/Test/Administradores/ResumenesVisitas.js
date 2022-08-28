const express = require('express')
const ResVisitas = express()
const SecureVerify = require("../../../lib/Funciones/SecureVerify")
const ArrayVisitMeses = require("../../../lib/Funciones/Resumenes/VisitasMeses")
const VisitasSemana = require('../../../lib/Funciones/Resumenes/VisitasSemana')
const AccionUsu = require('../../../lib/Funciones/Resumenes/AccionUsu')
const VisitasProv = require('../../../lib/Funciones/Resumenes/VisitasProvincias')
const VisitasNavegadores2 = require('../../../lib/Funciones/Resumenes/VisitasNavegadores')
const VisitasPlataforma2 = require('../../../lib/Funciones/Resumenes/VisitasDisp')
const VisitasMarcas2 = require('../../../lib/Funciones/Resumenes/VisitasMarcasCel')

ResVisitas.get('/test/ResVisitas', async (req, res) => {
    const token = req.headers['x-access-token']
    const isSecure = await SecureVerify(token)
    let resultado = []
    let respuesta = []
    console.log(`token`, token)
    if (isSecure) {
        const arrayVisitasMeses = await ArrayVisitMeses()
        console.log(`pasa1`)
        const arrayVisitasSemana = await VisitasSemana()
        console.log(`pasa2`)
        const accionUsuarios = await AccionUsu()
        console.log(`pasa3`)
        const visitasProvincias = await VisitasProv()
        console.log(`pasa4`)
        const visitNav = await VisitasNavegadores2()
        console.log(`pasa5`)
        const visitDisp = await VisitasPlataforma2()
        console.log(`pasa6`)
        const visitMarcas = await VisitasMarcas2()
        console.log(`pasa7`)
        resultado = {
            arrayVisitasMeses,
            arrayVisitasSemana,
            accionUsuarios,
            visitasProvincias,
            visitNav,
            visitDisp,
            visitMarcas
        }
        respuesta = {
            status: 200,
            result: resultado
        }
        res.send(respuesta)
    } else {
        respuesta = {
            status: 403,
            error: "No tiene los permisos!"
        }
        res.send(respuesta)
    }
})

module.exports = ResVisitas