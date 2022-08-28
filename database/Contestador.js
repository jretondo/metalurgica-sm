const mysql = require('mysql')

function Contestador(post, sql, req, res, DBname, jsonPersonalizado) {
    var respuesta = ""
    const conexion = mysql.createConnection({
        host: process.env.HOST_DB,
        user: process.env.USER_DB,
        password: process.env.PASS_DB,
        database: DBname
    });

    conexion.connect(error => {
        if (error) {
            console.log('error', error)
        } else {
            console.log("conectado a la base de datos " + DBname)
        }
    })
    if (post) {

        conexion.query({
            sql: sql,
            timeout: 2000,
            values: req
        }, (error, result) => {

            if (error) {
                if (error === null) {
                    respuesta = {
                        status: 200,
                        result: result,
                        miJson: jsonPersonalizado
                    }
                    res.json(respuesta)
                } else {
                    respuesta = {
                        status: 500,
                        error: "Ha habido un error en la consulta"
                    }
                    res.json(respuesta)
                }
            } else {
                respuesta = {
                    status: 200,
                    result: result,
                    miJson: jsonPersonalizado
                }
                res.json(respuesta)
            }
        })

    } else {

        conexion.query(sql, (error, result) => {
            if (error) {
                respuesta = {
                    status: 500,
                    error: "Ha habido un error en la consulta"
                }
                res.json(respuesta)
            } else {
                respuesta = {
                    status: 200,
                    result: result,
                    miJson: jsonPersonalizado
                }
                res.json(respuesta)
            }
        })

    }
    setTimeout(() => {
        conexion.destroy()
        console.log("desconectado de " + DBname)
    }, 5000);
}
module.exports = Contestador