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

const visitasArray = [
    {
        center: { lat: -24.58489, lng: -60.17313 },
        prov: "Formosa"
    },
    {
        center: { lat: -31.4135, lng: -63.88105 },
        prov: "Córdoba"
    },
    {
        center: { lat: -26.82414, lng: -65.2226 },
        prov: "Tucumán"
    },
    {
        center: { lat: -29.54881, lng: -60.70868 },
        prov: "Santa Fé"
    },
    {
        center: { lat: -27.79511, lng: -63.26149 },
        prov: "Santiago del Estero"
    },
    {
        center: { lat: -27.06708, lng: -54.59608 },
        prov: "Misiones"
    },
    {
        center: { lat: -22.59457, lng: -66.29712 },
        prov: "Jujuy"
    },
    {
        center: { lat: -24.7859, lng: -64.01166 },
        prov: "Salta"
    },
    {
        center: { lat: -30.9375, lng: -69.03639 },
        prov: "San Juan"
    },
    {
        center: { lat: -26.96957, lng: -67.78524 },
        prov: "Catamarca"
    },
    {
        center: { lat: -33.29501, lng: -66.03563 },
        prov: "San Luis"
    },
    {
        center: { lat: -29.71105, lng: -66.85067 },
        prov: "La Rioja"
    },
    {
        center: { lat: -34.89084, lng: -68.82717 },
        prov: "Mendoza"
    },
    {
        center: { lat: -37.01667, lng: -65.28333 },
        prov: "La Pampa"
    },
    {
        center: { lat: -38.95161, lng: -70.0591 },
        prov: "Neuquén"
    },
    {
        center: { lat: -40.51345, lng: -66.99668 },
        prov: "Río Negro"
    },
    {
        center: { lat: -44.30016, lng: -69.10228 },
        prov: "Chubut"
    },
    {
        center: { lat: -48.62261, lng: -70.21813 },
        prov: "Santa Crúz"
    },
    {
        center: { lat: -54.51084, lng: -67.31591 },
        prov: "Tierra del Fuego"
    },
    {
        center: { lat: -32.23271, lng: -59.00868 },
        prov: "Entre Rios"
    },
    {
        center: { lat: -26.5858, lng: -60.954 },
        prov: "Chaco"
    },
    {
        center: { lat: -28.76784, lng: -57.8344 },
        prov: "Corrientes"
    },
    {
        center: { lat: -36.71959, lng: -60.27243 },
        prov: "Provincia de Buenos Aires"
    },
    {
        center: { lat: -34.61315, lng: -58.37723 },
        prov: "Capital Federal"
    }
]

async function VisitasProv(resolve) {
    const query = Consultador()
    let lista = []
    const sql = ` SELECT provincia, COUNT(*) as visitas
    FROM actividad_usu 
    WHERE momento >= ? AND momento <= ? AND provincia <> ""  
    GROUP BY provincia 
    ORDER BY COUNT(*) DESC `
    let result

    try {
        result = await query({
            sql: sql,
            timeout: 2000,
            values: [ceroMesStr, ahoraStr]
        })
    } finally {
        const total = parseInt(result.length)
        result.map((resultado, key) => {
            const prov = resultado.provincia
            const visitas = resultado.visitas
            const found = visitasArray.find(element => element.prov == prov)
            console.log(`found`, found)
            if (found !== undefined) {
                const centro = found.center
                lista.push({
                    center: centro,
                    visitas: visitas,
                    ciudad: prov
                })
            }

            if (key === (total - 1)) {
                resolve(lista)
            }
        })
    }
}

const VisitasProv2 = () => {
    return new Promise(resolve => {
        (VisitasProv(resolve))
    })
}

module.exports = VisitasProv2