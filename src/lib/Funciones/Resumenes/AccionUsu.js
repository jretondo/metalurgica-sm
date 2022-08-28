const formatDate = require("../../../lib/Funciones/FormatDate")
const Consultador = require("../../../../database/Consultador")

const ahora = new Date()
ahora.setDate(ahora.getDate() + 1)
const ahoraStr = formatDate(ahora, "yyyy-mm-dd")
ahora.setDate(ahora.getDate() - 1)
const ahoraStr2 = formatDate(ahora, "yyyy-mm") + "-01"
const ahora2 = new Date(ahoraStr2)
const ceroMes = new Date(ahora2.setMonth(ahora2.getMonth() - 6))
const ceroMesStr = formatDate(ceroMes, "yyyy-mm") + "-01"

async function AccionUsu(resolve) {
    const query = Consultador()
    const sql = ` SELECT descr_tipo, COUNT(*) as visitas
    FROM actividad_usu WHERE momento >= ? AND momento <= ? 
    GROUP BY descr_tipo 
    ORDER BY COUNT(*) DESC `
    let tiposArray = []
    let visitasArray = []
    let resultados = []
    let indexArray = []
    let result
    console.log(`[ceroMesStr, ahoraStr]`, [ceroMesStr, ahoraStr])
    try {
        result = await query({
            sql: sql,
            timeout: 2000,
            values: [ceroMesStr, ahoraStr]
        })
    } finally {
        const total = parseInt(result.length)
        result.map((resultado, key) => {
            const index = parseInt(key) + 1
            const tipo = resultado.descr_tipo
            const visitas = resultado.visitas
            tiposArray.push(tipo)
            visitasArray.push(visitas)
            indexArray.push(index)

            if (parseInt(total - 1) === key) {
                resultados = {
                    tiposArray,
                    visitasArray,
                    indexArray
                }

                resolve(resultados)
            }
        })
    }
}

const AccionUsu2 = () => {
    return new Promise(resolve => {
        (AccionUsu(resolve))
    })
}
module.exports = AccionUsu2