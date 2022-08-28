const express = require('express')
const CalculoEnvio = express()
const Consultador = require("../../../../database/Consultador")

CalculoEnvio.post('/test/calcularEnvio', async (req, res) => {
    const query = Consultador()
    const request = req.body
    const listaProd = request.listaProd
    const zona = request.zona
    const domicilio = request.domicilio

    let domi
    if (domicilio) {
        domi = 1
    } else {
        domi = 0
    }
    const sql1 = `SELECT * FROM products_principal WHERE id = ?`
    const sql2 = `SELECT precio FROM correo_precios WHERE zona = ? AND domicilio = ? AND peso > ? ORDER BY peso ASC LIMIT 1`
    let result1
    let result2
    let respuesta = []

    const cant = parseInt(listaProd.length)

    function ArrayC(l1, l2, l3, w, name) {
        let arr = [l1, l2, l3].sort(function (a, b) {
            return b - a;
        });
        arr.push(w);
        arr.push(name);
        return arr;
    }

    if (cant > 0) {

        let paquete = []
        listaProd.map(async (idProd, key) => {
            try {
                result1 = await query({
                    sql: sql1,
                    timeout: 2000,
                    values: [idProd]
                })
            } finally {
                const x = result1[0].x
                const y = result1[0].y
                const z = result1[0].z
                const peso = result1[0].peso
                const name = result1[0].name

                const paq = ArrayC(x, y, z, peso, name)
                paquete.push(paq)
            }
            if ((cant - 1) === key) {
                let AP = [];
                let nameAnt = "";
                let Zprov = 0;
                let base = 0;
                const cant2 = paquete.length

                paquete.map((prod, key) => {
                    const Q = parseInt(AP.length);

                    if (Q === 0) {
                        Zprov = prod[0];
                        nameAnt = prod[4];
                        const Paq0 = ArrayC(prod[0], prod[1], prod[2], prod[3], prod[4]);
                        AP.push(Paq0);
                    } else {
                        nameAnt = nameAnt + ", " + prod[4];
                        const r = parseInt(AP.length - 1);
                        const W = AP[r][3] + prod[3];
                        if (W < 25000) {
                            const L0 = Zprov + prod[0];

                            if (L0 < 150) {
                                let L0ant = AP[r][0];
                                if (L0ant < L0) {
                                    L0ant = L0;
                                }

                                let L1 = prod[1];
                                if (L1 < AP[r][1]) {
                                    L1 = AP[r][1];
                                }

                                let L2 = prod[2];
                                if (L2 < AP[r][2]) {
                                    L2 = AP[r][2];
                                }

                                Zprov = L0;
                                const PaqI = ArrayC(L0ant, L1, L2, W, nameAnt);
                                AP.splice(r, 1, PaqI);
                            } else {
                                Zprov = 0;
                                base = (250 - AP[r][0]) / 2;
                                const L1 = AP[r][1] + prod[1];
                                if (L1 < base) {
                                    Zprov = prod[0];

                                    let L1Ant = AP[r][1];
                                    if (L1Ant < L1) {
                                        L1Ant = L1;
                                    }

                                    let L2 = prod[2];
                                    if (L2 < AP[r][2]) {
                                        L2 = AP[r][2];
                                    }

                                    const PaqI = ArrayC(AP[r][0], L1Ant, L2, W, nameAnt);
                                    AP.splice(r, 1, PaqI);
                                } else {
                                    const L2 = AP[r][2] + prod[2];
                                    if (L2 < base) {
                                        let L2Ant = AP[r][2];
                                        if (L2Ant < L2) {
                                            L2Ant = L2;
                                        }
                                        const PaqI = ArrayC(AP[r][0], AP[r][1], L2Ant, W, nameAnt);
                                        AP.splice(r, 1, PaqI);
                                    } else {
                                        Zprov = prod[0];
                                        const Paq0 = ArrayC(
                                            prod[0],
                                            prod[1],
                                            prod[2],
                                            prod[3],
                                            prod[4]
                                        );
                                        nameAnt = prod[4];
                                        AP.push(Paq0);
                                    }
                                }
                            }
                        } else {
                            Zprov = prod[0];
                            nameAnt = prod[4];
                            const Paq0 = ArrayC(prod[0], prod[1], prod[2], prod[3], prod[4]);
                            AP.push(Paq0);
                        }
                    }
                    if (key === (cant2 - 1)) {
                        let precio = 0
                        const cant3 = parseInt(AP.length)
                        AP.map(async (paqArm, key) => {
                            const peso = (paqArm[3] / 1000)
                            try {
                                result2 = await query({
                                    sql: sql2,
                                    timeout: 2000,
                                    values: [zona, domi, peso]
                                })
                            } finally {
                                precio = precio + parseFloat(result2[0].precio)

                                if (parseInt(cant3 - 1) === key) {
                                    respuesta = {
                                        status: 200,
                                        result: precio
                                    }

                                    res.send(respuesta);
                                }
                            }
                        })


                    }
                });
            }
        })
    } else {
        respuesta = {
            status: 401,
            result: 0
        }

        res.send(respuesta);
    }
})

module.exports = CalculoEnvio