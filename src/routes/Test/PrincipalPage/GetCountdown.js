const express = require('express')
const GetCountdown = express()
const Consultador = require("../../../../database/Consultador")
const FormatDate = require("../../../lib/Funciones/FormatDate3")
const FormatDate2 = require("../../../lib/Funciones/FormatDate")

GetCountdown.get("/test/get-countdown", async (req, res) => {
    const query = Consultador()
    const hoy = new Date()
    const HoyStr = FormatDate2(hoy, "yyyy-mm-dd hor:min:seg")
    const sql1 = `SELECT * FROM countdown_promo WHERE enabled = '1' AND date_limit > ?`

    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
            values: [HoyStr]
        })
    } finally {
        let countDownInfo = []

        if (result1.length === 0) {
            resultado = {
                status: 500,
                result: ""
            }
            res.send(resultado)
        } else {
            result1.map(countD => {
                const id = countD.id
                const image = countD.img_url
                const dateTime = new Date(countD.date_limit)
                const dateStr = FormatDate(dateTime)
                const titleText = countD.title

                countDownInfo.push({
                    "id": id,
                    "image": image,
                    "dateTime": dateStr,
                    "titleText": titleText
                })
            })

            resultado = {
                status: 200,
                result: countDownInfo
            }
            res.send(resultado)
        }
    }
})

module.exports = GetCountdown