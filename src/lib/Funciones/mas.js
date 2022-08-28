
const fs = require("fs")
var myCss = {
    style: fs.readFileSync(path.join(__dirname, './style.css'), 'utf8')
};
const logo = "https://nekonet.com.ar/logosClientes/cbaBaitcast/logo_chico.png"
const logoAfip1 = "https://nekonet.com.ar/logosClientes/cbaBaitcast/AFIP1.png"
const logoAfip2 = "https://nekonet.com.ar/logosClientes/cbaBaitcast/AFIP2.png"
const fechaFact = "25/04/2021"
const clienteName = "RETONDO JAVIER"
const clienteNro = "35092514"
const clienteDireccion = "Av Emilio Olmos 324, Córdoba"
const clienteEmail = "jretondo90@gmail.com"
const subTotal = "3.650,52"
const costoEnvio = "1.348,48"
const totalFact = "5.000,00"
const caeNro = "71109005769336"
const caeVto = "25/04/2021"
const item1 = {
    id: "1",
    name: "prueba 1",
    price: "1.200,00",
    cant: "2",
    total: "2.400,00"
}
const item2 = {
    id: "2",
    name: "prueba 2",
    price: "1.200,00",
    cant: "2",
    total: "2.400,00"
}
const item3 = {
    id: "3",
    name: "prueba 3",
    price: "1.200,00",
    cant: "2",
    total: "2.400,00"
}

let listaItems = []
listaItems.push(item1)
listaItems.push(item2)
listaItems.push(item3)

const factData = {
    "ver": 1,
    "fecha": "2020-10-13",
    "cuit": 30000000007,
    "ptoVta": 10,
    "tipoCmp": 1,
    "nroCmp": 94,
    "importe": 12100,
    "moneda": "PES",
    "ctz": 0,
    "tipoDocRec": 80,
    "nroDocRec": 20000000001,
    "tipoCodAut": "E",
    "codAut": 70417054367476
}

const pv = "00005"
const factNro = "00000258"