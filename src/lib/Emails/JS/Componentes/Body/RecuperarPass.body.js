const BodyRecPass = (saludo, nvaPass) => {
    return `
    <table
    cellpadding="0"
    cellspacing="0"
    border="0"
    width="88%"
    style="width: 88% !important; min-width: 88%; max-width: 88%"
  >
    <tr>
      <td align="left" valign="top">
        <div style="width: 100%; text-align: center">
          <font
            face="'Source Sans Pro', sans-serif"
            color="#1a1a1a"
            style="
              font-size: 52px;
              line-height: 60px;
              font-weight: 300;
              letter-spacing: -1.5px;
              margin: auto;
            "
          >
            <span
              style="
                font-family: 'Source Sans Pro', Arial, Tahoma,
                  Geneva, sans-serif;
                color: #1a1a1a;
                font-size: 40px;
                line-height: 60px;
                font-weight: bold;
                letter-spacing: -1.5px;
                text-align: center;
                margin: auto;
              "
              >Recuperar Contraseña</span
            >
          </font>
        </div>

        <div
          style="height: 33px; line-height: 33px; font-size: 31px"
        >
          &nbsp;
        </div>
        <font
          face="'Source Sans Pro', sans-serif"
          color="#585858"
          style="font-size: 24px; line-height: 32px"
        >
          <span
            style="
              font-family: 'Source Sans Pro', Arial, Tahoma,
                Geneva, sans-serif;
              color: #585858;
              font-size: 24px;
              line-height: 32px;
            "
            >${saludo}!</span
          >
        </font>
        <div
          style="height: 20px; line-height: 20px; font-size: 18px"
        >
          &nbsp;
        </div>
        <font
          face="'Source Sans Pro', sans-serif"
          color="#585858"
          style="font-size: 24px; line-height: 32px"
        >
          <span
            style="
              font-family: 'Source Sans Pro', Arial, Tahoma,
                Geneva, sans-serif;
              color: #585858;
              font-size: 24px;
              line-height: 32px;
            "
            >A continuación le pasamos una contraseña provisoria
            para poder ingresar a la plataforma:</span
          >
        </font>
        <div
          style="height: 33px; line-height: 33px; font-size: 31px"
        >
          &nbsp;
        </div>
        <table
          class="mob_btn"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            background: #626dde;
            border-radius: 7px;
            text-align: center;
            margin: auto;
            box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.32);
          "
        >
          <tr>
            <td align="center" valign="top">
              <a
                target="_blank"
                style="
                  display: block;
                  border: 1px solid #626dde;
                  border-radius: 7px;
                  padding: 12px 23px;
                  font-family: 'Source Sans Pro', Arial, Verdana,
                    Tahoma, Geneva, sans-serif;
                  color: #ffffff;
                  font-size: 20px;
                  line-height: 30px;
                  text-decoration: none;
                  white-space: nowrap;
                  font-weight: 600;
                "
              >
                <font
                  face="'Source Sans Pro', sans-serif"
                  color="#ffffff"
                  style="
                    font-size: 20px;
                    line-height: 30px;
                    text-decoration: none;
                    white-space: nowrap;
                    font-weight: 600;
                  "
                >
                  <span
                    style="
                      font-family: 'Source Sans Pro', Arial,
                        Verdana, Tahoma, Geneva, sans-serif;
                      color: #ffffff;
                      font-size: 20px;
                      line-height: 30px;
                      text-decoration: none;
                      white-space: nowrap;
                      font-weight: 600;
                    "
                    >${nvaPass}</span
                  >
                </font>
              </a>
            </td>
          </tr>
        </table>
        <div
          style="height: 75px; line-height: 75px; font-size: 73px"
        >
          &nbsp;
        </div>
        <font
          face="'Source Sans Pro', sans-serif"
          color="#585858"
          style="font-size: 24px; line-height: 32px"
        >
          <span
            style="
              font-family: 'Source Sans Pro', Arial, Tahoma,
                Geneva, sans-serif;
              color: #585858;
              font-size: 24px;
              line-height: 32px;
            "
            >Una vez ingresada esta contraseña, se le solicitará
            una nueva que usted recuerde.</span
          >
        </font>

        <div
          style="height: 75px; line-height: 75px; font-size: 73px"
        >
          &nbsp;
        </div>
      </td>
    </tr>
  </table>
      `
}

module.exports = BodyRecPass