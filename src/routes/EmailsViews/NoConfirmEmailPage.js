const express = require('express')
const NoEmailPruebaPages = express()
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../Global/Colors.json')
const Links = require('../../Global/Links.json')
const Names = require('../../Global/Names.json')

NoEmailPruebaPages.get('/emailV/NoconfirmEmailPage', async (req, res) => {

    ejs.renderFile(path.join(__dirname, '..', '..', '..', "views", "registrado.ejs"), function (err, data) {

        res.render('Pages/noRegistrado.ejs');

    });

})

module.exports = NoEmailPruebaPages