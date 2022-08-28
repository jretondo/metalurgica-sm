const Consultador = require("../../../database/Consultador")

async function DatosUsu(idUsu, resolve) {
    const query = Consultador()
    const sql = ` SELECT * FROM usuarios WHERE id = ? `
    let result
    try {
        result = await query({
            sql: sql,
            tiemout: 2000,
            values: [idUsu]
        })
    } finally {
        resolve(result)
    }
}

const DatosUsu2 = (idUsu) => {
    return new Promise(resolve => {
        (DatosUsu(idUsu, resolve))
    })
}

module.exports = DatosUsu2