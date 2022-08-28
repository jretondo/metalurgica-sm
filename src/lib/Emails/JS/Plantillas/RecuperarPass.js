const Wrapper = require("../Componentes/Wrappers/Wrapper1")
const Header = require("../Componentes/Header/Header1")
const Body = require("../Componentes/Body/RecuperarPass.body")
const Foother = require("../Componentes/Foother/Foother1")

const EmailRecPass = (logo, saludo, nvaPass, emailAyuda, year, emailinfo, linkIg, linkFb, linkTw, telInt, telStr) => {
    return Wrapper(Header(logo), Body(saludo, nvaPass), Foother(emailAyuda, year, emailinfo, linkIg, linkFb, linkTw, telInt, telStr), "")
}

module.exports = EmailRecPass