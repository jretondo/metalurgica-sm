const express = require('express')
const index = express()

index.get('/', (req, res) => {
    const ip = req.ip
    console.log(`ip`, ip)
    res.send("Bienvenido al Backend de Córdoba Baitcast!!")
})

module.exports = index