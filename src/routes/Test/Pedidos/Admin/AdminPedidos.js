const express = require("express");
const AdminPedidos = express();
const SecureVerify = require("../../../../lib/Funciones/SecureVerify")
const Consultador = require("../../../../../database/Consultador")
const formatDate = require("../../../../lib/Funciones/FormatDate")
const formatMoney = require("../../../../lib/Funciones/NumberFormat")

AdminPedidos.post("/test/AdminPedidos/:page", async (req, res) => {
  const token = req.headers["x-access-token"];
  const query = Consultador()
  const tipo = req.body.type
  const page = parseInt(req.params.page)
  const palabra = "%" + req.body.palabra + "%"
  const busquedaBool = req.body.busquedaBool

  let desde
  let status
  if (page === 1) {
    desde = 0
  } else {
    desde = (page - 1) * 10
  }
  if (tipo === "pend") {
    status = 1
  } else if (tipo === "end") {
    status = 3
  } else if (tipo === "env") {
    status = 2
  } else if (tipo === "canc") {
    status = 0
  } else {
    status = 0
    seguir = false
  }


  let sql1
  let sql4
  let values1
  let values4

  if (busquedaBool) {
    sql1 = ` SELECT DISTINCT payment_type, merchant_order_id, provincia, ciudad, costo_envio, desc_cupon FROM products_delivered WHERE (status = ?) AND (casilla LIKE ? OR nombre LIKE ? OR apellido LIKE ?) ORDER BY merchant_order_id DESC LIMIT ?, 10 `

    sql4 = ` SELECT COUNT(*) as TOTAL FROM products_delivered WHERE (status = ?) AND (casilla LIKE ? OR nombre LIKE ? OR apellido LIKE ?) ORDER BY merchant_order_id DESC `
    values1 = [status, palabra, palabra, palabra, desde]
    values4 = [status, palabra, palabra, palabra]
  } else {
    sql1 = ` SELECT DISTINCT payment_type, merchant_order_id, provincia, ciudad, costo_envio, desc_cupon FROM products_delivered WHERE status = ? ORDER BY merchant_order_id DESC LIMIT ?, 10 `
    sql4 = ` SELECT COUNT(*) as TOTAL FROM products_delivered WHERE status = ? ORDER BY merchant_order_id DESC `
    values1 = [status, desde]
    values4 = [status]
  }

  const sql2 = ` SELECT SUM(price) as total, SUM(costo_prod) as costosTotal FROM products_delivered WHERE merchant_order_id = ? `
  const sql3 = ` SELECT date_payment FROM products_delivered WHERE merchant_order_id = ? ORDER BY date_payment ASC LIMIT 1 `

  let result1
  let result2
  let result3
  let result4
  let seguir = true
  let resultado = []
  let respuesta = []
  const isSecure = await SecureVerify(token)
  let array
  let cantTotal
  let paginas = []
  let ultPagina = 1
  if (isSecure) {
    if (seguir) {

      try {
        result4 = await query({
          sql: sql4,
          timeout: 2000,
          values: values4
        })
      } finally {
        console.log(`result4`, result4)
        cantTotal = result4[0].TOTAL
        if (cantTotal === 0) {
          array = {
            listado: [],
            cantTotal: 0,
            totalPag: 0
          }
          resultado = {
            status: 200,
            result: array
          }
          res.send(resultado)
        } else {
          if (cantTotal < 10) {
            paginas.push(1)
          } else {
            const paginasFloat = parseFloat(cantTotal / 10)
            const paginasInt = parseInt(cantTotal / 10)
            let totalPag
            if (paginasFloat > paginasInt) {
              totalPag = paginasInt + 1
            } else {
              if (paginasInt === 0) {
                totalPag = 1
              } else {
                totalPag = paginasInt
              }
            }

            ultPagina = totalPag

            for (let i = 0; i < totalPag; i++) {
              const paginaLista = i + 1
              const limiteInf = page - 3
              const limiteSup = page + 3
              if (paginaLista > limiteInf && paginaLista < limiteSup)
                paginas.push(paginaLista)
            }

          }

        }

        try {
          result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: values1
          })
        } finally {

          let cant
          let totalDescuento
          try {
            totalDescuento = parseFloat(result1[0].desc_cupon)
          } catch (error) {
            totalDescuento = 0
          }
          try {
            cant = parseInt(result1.length)
          } catch (error) {
            cant = 0
          }

          if (cant > 0) {
            result1.map(async (item, key) => {
              const idOrden = item.merchant_order_id
              try {
                result3 = await query({
                  sql: sql3,
                  timeout: 2000,
                  values: [idOrden]
                })
              } finally {
                const fechaPago = formatDate(result3[0].date_payment, "dd/mm/yyyy")
                const tipoPago = item.payment_type
                const provincia = item.provincia
                const ciudad = item.ciudad
                const costoEnvio = parseFloat(item.costo_envio)

                try {
                  result2 = await query({
                    sql: sql2,
                    timeout: 2000,
                    values: [idOrden]
                  })
                } finally {
                  console.log(`totalDescuento`, totalDescuento)
                  const totalPrecio = result2[0].total
                  const costosTotal = result2[0].costosTotal
                  const totaPrice = formatMoney((totalPrecio + costoEnvio - totalDescuento), 2)
                  console.log(`totalPrecio`, totalPrecio)
                  console.log(`costoEnvio`, costoEnvio)
                  console.log(`totaPrice`, totaPrice)
                  resultado.push({
                    tipoPago,
                    idOrden,
                    fechaPago,
                    provincia,
                    ciudad,
                    totaPrice,
                    costosTotal
                  })
                }

                if ((parseInt(cant - 1) === key)) {
                  array = {
                    listado: resultado,
                    cantTotal: paginas,
                    totalPag: ultPagina
                  }

                  respuesta = {
                    status: 200,
                    result: array
                  }
                  res.send(respuesta)
                }
              }
            })
          } else {
            respuesta = {
              status: 201,
              result1: []
            }
            res.send(respuesta)
          }
        }
      }
    } else {
      respuesta = {
        status: 500,
        error: "Error en la consulta"
      }
      res.send(respuesta)
    }
  } else {
    respuesta = {
      status: 403,
      error: "No tiene los permisos!"
    }
    res.send(respuesta)
  }
});

module.exports = AdminPedidos;
