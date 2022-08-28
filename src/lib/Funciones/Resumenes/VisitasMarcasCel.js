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
const backgroundColor = [
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)'
]
const bordColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)'
]

const options = {
    indexAxis: 'y',
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            position: 'right',
        },
        title: {
            display: true,
            text: '',
        },
    },
};

async function VisitasMarcas(resolve) {
    const query = Consultador()
    const sql1 = ` SELECT dispositivo, COUNT(*) as visitas
    FROM actividad_usu 
    WHERE momento >= ? AND momento <= ? AND dispositivo_tipo = 'mobile'
    GROUP BY dispositivo 
    ORDER BY COUNT(*) DESC LIMIT 5 `
    const sql2 = ` SELECT COUNT(*) as visitas FROM actividad_usu WHERE momento >= ? AND momento <= ? `
    let result1
    let result2
    let arrayNav = []
    let cantVisitas = []
    let bgColors = []
    let borderColors = []
    let lblDet = []
    let resultados = []

    try {
        result2 = await query({
            sql: sql2,
            timeout: 2000,
            values: [ceroMesStr, ahoraStr]
        })
    } finally {
        const totalVisitas = result2[0].visitas
        try {
            result1 = await query({
                sql: sql1,
                timeout: 2000,
                values: [ceroMesStr, ahoraStr]
            })
        } finally {
            let totalNav = 0
            const total = parseInt(result1.length)
            if (total > 0) {
                result1.map((resultado, key) => {
                    const navegador = resultado.dispositivo
                    const visitas = resultado.visitas
                    totalNav = parseInt(visitas) + totalVisitas
                    const bgColorItem = backgroundColor[key]
                    const borderColorItem = bordColor[key]
                    arrayNav.push(navegador)
                    cantVisitas.push(visitas)
                    bgColors.push(bgColorItem)
                    borderColors.push(borderColorItem)
                    lblDet.push({
                        nav: navegador,
                        bg: bgColorItem,
                        bord: borderColorItem
                    })
                    if (key === (total - 1)) {
                        const otrosVisit = totalVisitas - totalNav
                        if (otrosVisit > 0) {
                            arrayNav.push("Otros")
                            cantVisitas.push(otrosVisit)
                            bgColors.push('rgba(255, 159, 64, 0.4)')
                            borderColors.push('rgba(255, 159, 64, 1)')
                            lblDet.push({
                                nav: 'Otros',
                                bg: 'rgba(255, 159, 64, 0.4)',
                                bord: 'rgba(255, 159, 64, 1)'
                            })
                        }
                        resultados = {
                            labels: arrayNav,
                            datasets: [
                                {
                                    label: "visitas",
                                    data: cantVisitas,
                                    backgroundColor: bgColors,
                                    borderColor: borderColors,
                                    borderWidth: 2,
                                }
                            ]
                        }

                        const lista = {
                            resultados,
                            options,
                            lblDet
                        }
                        resolve(lista)
                    }
                })
            } else {
                const lista = {
                    resultados,
                    options,
                    lblDet
                }
                resolve(lista)
            }
        }
    }
}

const VisitasMarcas2 = () => {
    return new Promise(resolve => {
        (VisitasMarcas(resolve))
    })
}

module.exports = VisitasMarcas2