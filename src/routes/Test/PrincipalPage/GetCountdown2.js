const express = require('express')
const GetCountdown = express()
const Consultador = require("../../../../database/Consultador")
const FormatDate = require("../../../lib/Funciones/FormatDate3")

GetCountdown.get("/test/get-countdown2", async (req, res) => {
    const query = Consultador()
    const sql1 = `SELECT * FROM countdown_promo`

    let result1

    try {
        result1 = await query({
            sql: sql1,
            timeout: 2000,
        })
    } finally {
        let countDownInfo = []
        result1.map(countD => {
            const id = countD.id
            const image = countD.img_url
            const dateTime = new Date(countD.date_limit)
            const dateStr = FormatDate(dateTime)
            const titleText = countD.title
            const enabled = countD.enabled

            countDownInfo.push({
                "id": id,
                "image": image,
                "dateTime": dateStr,
                "titleText": titleText,
                "enabled": enabled
            })
        })

        resultado = {
            status: 200,
            result: countDownInfo
        }
        res.send(resultado)
    }
})

module.exports = GetCountdown