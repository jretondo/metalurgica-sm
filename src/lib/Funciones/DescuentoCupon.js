const FormatDate = require("../../lib/Funciones/FormatDate")
const Consultador = require("../../../database/Consultador")

const TotalImporte = async (itemsCart) => {
    let precioTotal = 0
    // eslint-disable-next-line
    itemsCart.map((cartItem) => {
        precioTotal = precioTotal + parseFloat(cartItem.price - cartItem.discount)
    })
    return precioTotal
}

const CalculoCupon = async (itemsCart, cupon) => {
    const query = Consultador()
    const ahora = FormatDate(new Date(), "yyyy-mm-dd hor:min:seg")
    const totalProductos = await TotalImporte(itemsCart)
    const sql1 = ` SELECT * FROM cupones_tb WHERE cupon = ? AND vto_cupon > ? `
    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [cupon, ahora]
        })
    } finally {
        const tipo = parseInt(result1[0].desc_tipo)
        const porcentaje = parseInt(result1[0].porc)
        const montoDesc = parseFloat(result1[0].monto_dec)
        const descMax = parseFloat(result1[0].desc_max)
        const montoMin = parseFloat(result1[0].monto_min)

        if (tipo === 0) {
            if (totalProductos > montoMin) {
                return montoDesc
            } else {
                return 0
            }
        } else {
            if (totalProductos >= montoMin) {
                const descuentoPAplicar = parseFloat((porcentaje / 100) * totalProductos)
                if (descuentoPAplicar > descMax) {
                    return descMax
                } else {
                    return descuentoPAplicar
                }
            } else {
                return 0
            }
        }
    }
}

module.exports = CalculoCupon