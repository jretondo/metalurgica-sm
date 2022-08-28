const Consultador = require("../../../../database/Consultador")
const formatDate = require("../../../lib/Funciones/FormatDate")

const ahora = new Date()
ahora.setDate(ahora.getDate() + 1)
const ahoraStr = formatDate(ahora, "yyyy-mm-dd")
ahora.setDate(ahora.getDate() - 1)
const ahoraDiaSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(ahora)
const ceroDia = new Date(ahora.setDate(ahora.getDate() - 1))
const ceroStr = formatDate(ceroDia, "yyyy-mm-dd")
const ceroDiaSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(ceroDia)
const primerDia = new Date(ahora.setDate(ahora.getDate() - 1))
const primerStr = formatDate(primerDia, "yyyy-mm-dd")
const primerDiaSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(primerDia)
const segundoDia = new Date(ahora.setDate(ahora.getDate() - 1))
const segundoStr = formatDate(segundoDia, "yyyy-mm-dd")
const segundoDiaSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(segundoDia)
const tercerDia = new Date(ahora.setDate(ahora.getDate() - 1))
const tercerStr = formatDate(tercerDia, "yyyy-mm-dd")
const tercerDiaSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(tercerDia)
const cuartoDia = new Date(ahora.setDate(ahora.getDate() - 1))
const cuartoStr = formatDate(cuartoDia, "yyyy-mm-dd")
const cuartoDiaSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(cuartoDia)
const quintoDia = new Date(ahora.setDate(ahora.getDate() - 1))
const quintoStr = formatDate(quintoDia, "yyyy-mm-dd")
const quintoDiaSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(quintoDia)
const sextoDia = new Date(ahora.setDate(ahora.getDate() - 1))
const sextoStr = formatDate(sextoDia, "yyyy-mm-dd")
const sextoDiaSemana = new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(sextoDia)



async function VisitasSemana(resolve) {
    const query = Consultador()
    const arrayDias = [quintoStr, cuartoStr, tercerStr, segundoStr, primerStr, ceroStr, ahoraStr]
    const arrayPeriodos = [quintoDiaSemana, cuartoDiaSemana, tercerDiaSemana, segundoDiaSemana, primerDiaSemana, ceroDiaSemana, ahoraDiaSemana]
    const sql = ` SELECT COUNT(*) as visitas FROM actividad_usu WHERE momento >= ? AND momento <= ? `
    let arrayVisitas = []

    arrayDias.map(async (dia, key) => {
        let result
        let diaAnt
        if (key === 0) {
            diaAnt = sextoStr
        } else {
            const i = parseInt(key - 1)
            diaAnt = arrayDias[i]
        }

        try {
            result = await query({
                sql: sql,
                timeout: 2000,
                values: [diaAnt, dia]
            })
        } finally {
            arrayVisitas.push(result[0].visitas)
            if (key === 6) {
                resolve({
                    arrayVisitas,
                    arrayPeriodos
                })
            }
        }
    })
}

const VisitasSemana2 = () => {
    return new Promise(resolve => {
        (VisitasSemana(resolve))
    })
}
module.exports = VisitasSemana2