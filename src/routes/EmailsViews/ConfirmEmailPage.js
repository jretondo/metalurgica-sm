const express = require('express')
const EmailPruebaPages = express()
const ejs = require("ejs");
const path = require('path');
const Colors = require('../../Global/Colors.json')
const Links = require('../../Global/Links.json')
const Names = require('../../Global/Names.json')

EmailPruebaPages.get('/emailV/confirmEmailPage', async (req, res) => {


    ejs.renderFile(path.join(__dirname, '..', '..', '..', "views", "registrado.ejs"), function (err, data) {

        res.render('Pages/registrado.ejs');

    });

})

module.exports = EmailPruebaPages