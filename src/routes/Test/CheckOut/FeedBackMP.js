const express = require('express')
const FeedBack = express()

FeedBack.get('/test/Feedback', (req, res) => {
    res.json({
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id
    })
})

module.exports = FeedBack