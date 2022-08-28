const Prefoother1 = (imgQuien, nombreQuien, tituloQuien, firmaTeam) => {
    return (
        `
        <table
cellpadding="0"
cellspacing="0"
border="0"
width="88%"
style="width: 88% !important; min-width: 88%; max-width: 88%">
<tr>
  <td align="center" valign="top">
    <!--[if (gte mso 9)|(IE)]>
         <table border="0" cellspacing="0" cellpadding="0">
         <tr><td align="center" valign="top" width="50"><![endif]-->
    <div
      style="
        display: inline-block;
        vertical-align: top;
        width: 50px;
      "
    >
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        width="100%"
        style="
          width: 100% !important;
          min-width: 100%;
          max-width: 100%;
        "
      >
        <tr>
          <td align="center" valign="top">
            <div
              style="
                height: 13px;
                line-height: 13px;
                font-size: 11px;
              "
            >
              &nbsp;
            </div>
            <div style="display: block; max-width: 50px">
              <img
                src="${imgQuien}"
                alt="img"
                width="60"
                border="0"
                style="
                  display: block;
                  width: 60px;
                  border-radius: 30px;
                "
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <!--[if (gte mso 9)|(IE)]></td><td align="left" valign="top" width="390"><![endif]-->
    <div
      class="mob_div"
      style="
        display: inline-block;
        vertical-align: top;
        width: 62%;
        min-width: 260px;
      "
    >
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        width="100%"
        style="
          width: 100% !important;
          min-width: 100%;
          max-width: 100%;
        "
      >
        <tr>
          <td
            width="18"
            style="
              width: 18px;
              max-width: 18px;
              min-width: 18px;
            "
          >
            &nbsp;
          </td>
          <td class="mob_center" align="left" valign="top">
            <div
              style="
                height: 13px;
                line-height: 13px;
                font-size: 11px;
              "
            >
              &nbsp;
            </div>
            <font
              face="'Source Sans Pro', sans-serif"
              color="#000000"
              style="
                font-size: 19px;
                line-height: 23px;
                font-weight: 600;
              "
            >
              <span
                style="
                  font-family: 'Source Sans Pro', Arial,
                    Tahoma, Geneva, sans-serif;
                  color: #000000;
                  font-size: 19px;
                  line-height: 23px;
                  font-weight: 600;
                "
                >${nombreQuien}</span
              >
            </font>
            <div
              style="
                height: 1px;
                line-height: 1px;
                font-size: 1px;
              "
            >
              &nbsp;
            </div>
            <font
              face="'Source Sans Pro', sans-serif"
              color="#7f7f7f"
              style="font-size: 19px; line-height: 23px"
            >
              <span
                style="
                  font-family: 'Source Sans Pro', Arial,
                    Tahoma, Geneva, sans-serif;
                  color: #7f7f7f;
                  font-size: 19px;
                  line-height: 23px;
                "
                >${tituloQuien}</span
              >
            </font>
          </td>
          <td
            width="18"
            style="
              width: 18px;
              max-width: 18px;
              min-width: 18px;
            "
          >
            &nbsp;
          </td>
        </tr>
      </table>
    </div>
    <!--[if (gte mso 9)|(IE)]></td><td align="left" valign="top" width="177"><![endif]-->
    <div
      style="
        display: inline-block;
        vertical-align: top;
        width: 177px;
      "
    >
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        width="100%"
        style="
          width: 100% !important;
          min-width: 100%;
          max-width: 100%;
        "
      >
        <tr>
          <td align="center" valign="top">
            <div
              style="
                height: 13px;
                line-height: 13px;
                font-size: 11px;
              "
            >
              &nbsp;
            </div>
            <div style="display: block; max-width: 177px">
              <img
                src="${firmaTeam}"
                alt="img"
                width="177"
                border="0"
                style="
                  display: block;
                  width: 177px;
                  max-width: 100%;
                "
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <!--[if (gte mso 9)|(IE)]>
         </td></tr>
         </table><![endif]-->
    <div
      style="height: 30px; line-height: 30px; font-size: 28px"
    >
      &nbsp;
    </div>
  </td>
</tr>
</table>
`

    )
}

module.exports = Prefoother1