const formatDate = require("../../../lib/Funciones/FormatDate")
const formatDate2 = require("../../../lib/Funciones/FormatDate4")
const Consultador = require("../../../../database/Consultador")

const ahora = new Date()
ahora.setDate(ahora.getDate() + 1)
const ahoraStr = formatDate(ahora, "yyyy-mm-dd")
ahora.setDate(ahora.getDate() - 1)
const ahoraStr2 = formatDate(ahora, "yyyy-mm") + "-01"
const ahora2 = new Date(ahoraStr2)
const ahoraPeriodo = formatDate2(ahora)

const ceroMes = new Date(ahora2.setMonth(ahora2.getMonth() - 1))
const ceroMesStr = formatDate(ceroMes, "yyyy-mm") + "-01"
const ceroPeriodo = formatDate2(ceroMes)
const primerMes = new Date(ahora2.setMonth(ahora2.getMonth() - 1))

const primerMesStr = formatDate(primerMes, "yyyy-mm") + "-01"
const primerPeriodo = formatDate2(primerMes)
const segundoMes = new Date(ahora2.setMonth(ahora2.getMonth() - 1))
const segundoMesStr = formatDate(segundoMes, "yyyy-mm") + "-01"
const segundoPeriodo = formatDate2(segundoMes)
const tercerMes = new Date(ahora2.setMonth(ahora2.getMonth() - 1))
const tercerMesStr = formatDate(tercerMes, "yyyy-mm") + "-01"
const tercerPeriodo = formatDate2(tercerMes)
const cuartoMes = new Date(ahora2.setMonth(ahora2.getMonth() - 1))
const cuartoMesStr = formatDate(cuartoMes, "yyyy-mm") + "-01"
const cuartoPeriodo = formatDate2(cuartoMes)
const quintoMes = new Date(ahora2.setMonth(ahora2.getMonth() - 1))
const quintoMesStr = formatDate(quintoMes, "yyyy-mm") + "-01"
const quintoPeriodo = formatDate2(quintoMes)

async function ResumenVisitasMeses(resolve) {
    const query = Consultador()
    const arrayFechas = [cuartoMesStr, tercerMesStr, segundoMesStr, primerMesStr, ceroMesStr, ahoraStr]
    const arrayPeriodos = [cuartoPeriodo, tercerPeriodo, segundoPeriodo, primerPeriodo, ceroPeriodo, ahoraPeriodo]
    const sql = ` SELECT COUNT(*) as visitas FROM actividad_usu WHERE momento >= ? AND momento <= ? `
    let arrayVisitas = []
    console.log(`arrayFechas`, arrayFechas)
    arrayFechas.map(async (mes, key) => {
        let result
        try {
            result = await query({
                sql: sql,
                timeout: 2000,
                values: [quintoMesStr, mes]
            })
        } finally {
            arrayVisitas.push(result[0].visitas)
            if (key === 5) {
                resolve({
                    arrayVisitas,
                    arrayPeriodos
                })
            }
        }
    })
}

const ResumenVisitasMeses2 = () => {
    return new Promise(resolve => {
        (ResumenVisitasMeses(resolve))
    })
}

module.exports = ResumenVisitasMeses2