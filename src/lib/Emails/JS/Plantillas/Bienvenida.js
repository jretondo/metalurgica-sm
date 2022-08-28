const Wrapper = require("../Componentes/Wrappers/Wrapper1")
const Header = require("../Componentes/Header/Header1")
const Body = require("../Componentes/Body/Bienvenida.body")
const PreFoother = require("../Componentes/Prefoother/Prefoother1")
const Foother = require("../Componentes/Foother/Foother1")

const EmailBienvenida = (logo, host, port, branch, token, nombre, emailAyuda, year, emailinfo, linkIg, linkFb, linkTw, telInt, telStr, imgQuien, nombreQuien, tituloQuien, firmaTeam) => {
  return Wrapper(Header(logo), Body(host, port, branch, token, nombre), Foother(emailAyuda, year, emailinfo, linkIg, linkFb, linkTw, telInt, telStr), PreFoother(imgQuien, nombreQuien, tituloQuien, firmaTeam))
}

module.exports = EmailBienvenida