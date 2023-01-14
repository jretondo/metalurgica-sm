const express = require('express')
const bodyParser = require('body-parser')
var morgan = require('morgan')
require('dotenv').config()
const PORT = process.env.PORTJS || 3005
const app = express()
var cors = require('cors')
const path = require('path')
var fs = require('fs'),
    https = require('https')


const ENTORNO = process.env.ENTORNO

app.use(bodyParser.json())
app.use(express.json())

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

morgan('dev')
app.use(cors())

if (ENTORNO === "WINDOWS") {
    app.listen(PORT, () => {
        console.log("conectado en el puerto " + PORT)
    })
} else {
    var options = {
        key: fs.readFileSync(__dirname + '/private.key', 'utf8'),
        cert: fs.readFileSync(__dirname + '/certificate.crt', 'utf8')
    };
    https.createServer(options, app).listen(PORT, function () {
        console.log("Express server listening on port " + PORT)
    });
}
app.use("/public", express.static(path.join(__dirname, "..", "Public")));

app.use(require("./routes/Test/Index"))

app.use(require("./routes/Test/Usuario/CambioEmail"))

app.use(require("./routes/Test/ActividadesApp/RegActividades"))

app.use(require("./routes/Test/PrincipalPage/blogFav"))
app.use(require("./routes/Test/PrincipalPage/GetCountdown"))
app.use(require("./routes/Test/PrincipalPage/GetCountdown2"))
app.use(require("./routes/Test/PrincipalPage/HeroSlider"))
app.use(require("./routes/Test/PrincipalPage/HeroSlider2"))

app.use(require("./routes/Test/Blog/BlogList"))
app.use(require("./routes/Test/Blog/BlogSingle"))

app.use(require("./routes/Test/Contacto/ContactInfo"))
app.use(require("./routes/Test/Contacto/ContactRedes"))

app.use(require("./routes/Test/Products/ProdList"))
app.use(require("./routes/Test/Products/ProdListAcc"))
app.use(require("./routes/Test/Products/CategList"))
app.use(require("./routes/Test/Products/CategListAcc"))
app.use(require("./routes/Test/Products/SubCategListAcc"))

app.use(require("./routes/Test/Administradores/Ingresar"))
app.use(require("./routes/Test/Administradores/NvaPass"))
app.use(require("./routes/Test/Administradores/RecPass"))
app.use(require("./routes/Test/Administradores/VerifLog"))
app.use(require("./routes/Test/Administradores/ResumenesVisitas"))
app.use(require("./routes/Test/Administradores/ConsultaIP"))
app.use(require("./routes/Test/Administradores/UltimasVisitas"))

app.use(require("./routes/Test/HeroSliderAdmin/DesactivarOff"))
app.use(require("./routes/Test/HeroSliderAdmin/EliminarHero"))
app.use(require("./routes/Test/HeroSliderAdmin/DetallesOffer"))
app.use(require("./routes/Test/HeroSliderAdmin/UploadImgHero"))
app.use(require("./routes/Test/HeroSliderAdmin/ModHeroId"))
app.use(require("./routes/Test/HeroSliderAdmin/NvoHeroSlide"))
app.use(require("./routes/Test/HeroSliderAdmin/OptimizedImgHero"))

app.use(require("./routes/Test/CountDown/ActivarCountDown"))
app.use(require("./routes/Test/CountDown/UploadImgCountD"))
app.use(require("./routes/Test/CountDown/ModDatosCountD"))

app.use(require("./routes/Test/Productos/ChangeStateProduct"))
app.use(require("./routes/Test/Productos/EliminarProducto"))
app.use(require("./routes/Test/Productos/NuevoProducto"))
app.use(require("./routes/Test/Productos/UploadImgProd"))
app.use(require("./routes/Test/Productos/TagsList"))
app.use(require("./routes/Test/Productos/UnProducto"))
app.use(require("./routes/Test/Productos/ModProducto"))
app.use(require("./routes/Test/Productos/OptimizedImg"))
app.use(require("./routes/Test/Productos/NuevoComment"))
app.use(require("./routes/Test/Productos/PruebaUrlExt"))
app.use(require("./routes/Test/Productos/ListaTiposVar"))
app.use(require("./routes/Test/Productos/ListaVariedades"))
app.use(require("./routes/Test/Productos/Proveedores"))
app.use(require("./routes/Test/Productos/AumentarPrecios"))
app.use(require("./routes/Test/Productos/AplicarDescuento"))
app.use(require("./routes/Test/Productos/EtiquetaGral"))
app.use(require("./routes/Test/Productos/QuitarEtiqueta"))

app.use(require("./routes/Test/Usuario/NuevoUsu"))
app.use(require("./routes/Test/Usuario/InicioSesion"))
app.use(require("./routes/Test/Usuario/AutoLogin"))
app.use(require("./routes/Test/Usuario/ModInfoPersonal"))
app.use(require("./routes/Test/Usuario/ModInfoDirection"))
app.use(require("./routes/Test/Usuario/RecPass"))
app.use(require("./routes/Test/Usuario/CambioPass"))
app.use(require("./routes/Test/Usuario/SuscribirseNews"))
app.use(require("./routes/Test/Usuario/ContactMe"))
app.use(require("./routes/Test/Usuario/ConfirmarEmail"))
app.use(require("./routes/Test/Usuario/ReenviarEmail"))
app.use(require("./routes/Test/Usuario/GetLocationGoogle"))

app.use(require("./routes/Test/Administradores/DeleteOldVisit"))
app.use(require("./routes/Test/Usuario/GetLocationGoogle2"))

app.use(require("./routes/Test/PruebaEmailEjs"))
app.use(require("./routes/Test/PruebaEnvioEmailEjs"))

app.use(require("./routes/EmailsViews/ConfirmEmail"))
app.use(require("./routes/EmailsViews/ForgotPass"))
app.use(require("./routes/EmailsViews/Marketing"))
app.use(require("./routes/EmailsViews/NewsPlatform"))
app.use(require("./routes/EmailsViews/FactEmail"))
app.use(require("./routes/EmailsViews/Contactenos"))
app.use(require("./routes/EmailsViews/ConfirmEmailPage"))
app.use(require("./routes/EmailsViews/NoConfirmEmailPage"))
app.use(require("./routes/EmailsViews/CodSeguimiento"))

app.use(require("./routes/Test/CheckOut/Provincias"))
app.use(require("./routes/Test/CheckOut/Ciudades"))
app.use(require("./routes/Test/CheckOut/CodigosPostales"))
app.use(require("./routes/Test/CheckOut/Locales"))
app.use(require("./routes/Test/CheckOut/CalcularEnvio"))
app.use(require("./routes/Test/CheckOut/NuevoPedido"))

app.use(require("./routes/Test/CheckOut/CreatePreference"))
app.use(require("./routes/Test/CheckOut/FeedBackMP"))

app.use(require("./routes/Test/Pedidos/PedidosPendientes"))
app.use(require("./routes/Test/Pedidos/PedidosCompletos"))
app.use(require("./routes/Test/Pedidos/CancelarPedido"))
app.use(require("./routes/Test/Pedidos/DetallesPedidoPend"))

app.use(require("./routes/Test/Pedidos/Admin/AdminPedidos"))
app.use(require("./routes/Test/Pedidos/Admin/BuscarPedidoUsu"))
app.use(require("./routes/Test/Pedidos/Admin/ConfirmEnvio"))
app.use(require("./routes/Test/Pedidos/Admin/CancelarPedido"))
app.use(require("./routes/Test/Pedidos/Admin/NotaCreditoWS"))
app.use(require("./routes/Test/Pedidos/Admin/GetInfoEnvioPDF"))
app.use(require("./routes/Test/Pedidos/Admin/DetallesPedidoPend"))
app.use(require("./routes/Test/Pedidos/Admin/PedidoEntregado"))

app.use(require("./routes/Test/Facturacion/FacturacionWS"))
app.use(require("./routes/Test/Facturacion/EnviarFactura"))
app.use(require("./routes/Test/Facturacion/NotaCreditoWS"))
app.use(require("./routes/Test/Facturacion/EstadoAfip"))

app.use(require("./routes/Test/Descuentos/AplicarCupon"))
app.use(require("./routes/Test/Descuentos/CorroborarCupon"))
app.use(require("./routes/Test/Descuentos/NuevoCupon"))
app.use(require("./routes/Test/Descuentos/ListaCupones"))
app.use(require("./routes/Test/Descuentos/EliminarCupon"))
app.use(require("./routes/Test/Descuentos/EliminarVencidos"))

app.use(require("./routes/Test/EnvioEmails/CasillasEmails"))
app.use(require("./routes/Test/EnvioEmails/CiudadesHab"))
app.use(require("./routes/Test/EnvioEmails/ProvinciasHab"))

app.use(require("./routes/Test/EnvioEmails/Previsualizar/EnvioCupon"))
app.use(require("./routes/Test/EnvioEmails/Previsualizar/EmailLibre"))
app.use(require("./routes/Test/EnvioEmails/Previsualizar/EnvioEmailMkt"))
app.use(require("./routes/Test/EnvioEmails/EnviarCupones"))
app.use(require("./routes/Test/EnvioEmails/EnviarEmailLibre"))
app.use(require("./routes/Test/EnvioEmails/EnviarEmailMkt"))

app.use(require("./routes/Test/CorreosAr/PreciosGet"))
app.use(require("./routes/Test/CorreosAr/UpdatePrices"))