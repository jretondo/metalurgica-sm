
const Wrapper1 = (header, body, foother, prefoother) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>Mailto</title>
      <link
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700"
        rel="stylesheet"
      />
      <style type="text/css">
        html {
          -webkit-text-size-adjust: none;
          -ms-text-size-adjust: none;
        }
  
        @media only screen and (min-device-width: 750px) {
          .table750 {
            width: 750px !important;
          }
        }
        @media only screen and (max-device-width: 750px),
          only screen and (max-width: 750px) {
          table[class="table750"] {
            width: 100% !important;
          }
          .mob_b {
            width: 93% !important;
            max-width: 93% !important;
            min-width: 93% !important;
          }
          .mob_b1 {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
          }
          .mob_left {
            text-align: left !important;
          }
          .mob_soc {
            width: 50% !important;
            max-width: 50% !important;
            min-width: 50% !important;
          }
          .mob_menu {
            width: 50% !important;
            max-width: 50% !important;
            min-width: 50% !important;
            box-shadow: inset -1px -1px 0 0 rgba(255, 255, 255, 0.2);
          }
          .mob_center {
            text-align: center !important;
          }
          .top_pad {
            height: 15px !important;
            max-height: 15px !important;
            min-height: 15px !important;
          }
          .mob_pad {
            width: 15px !important;
            max-width: 15px !important;
            min-width: 15px !important;
          }
          .mob_div {
            display: block !important;
          }
        }
        @media only screen and (max-device-width: 550px),
          only screen and (max-width: 550px) {
          .mod_div {
            display: block !important;
          }
        }
        .table750 {
          width: 750px;
        }
      </style>
    </head>
    <body
      style="
        margin: 0;
        padding: 0;
        background: linear-gradient(87deg, #626dde 0, #8b62de 100%);
      "
    >
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        width="100%"
        style="
          background: linear-gradient(87deg, #626dde 0, #8b62de 100%);
          min-width: 350px;
          font-size: 1px;
          line-height: normal;
        ">
        <tr>
          <td align="center" valign="top">          
         ${header}
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="750"
              class="table750"
              style="
                width: 100%;
                max-width: 750px;
                min-width: 350px;
                background: #fece1a;
              "
            >
              <tr>
                <td
                  class="mob_pad"
                  width="25"
                  style="width: 25px; max-width: 25px; min-width: 25px"
                >
                  &nbsp;
                </td>
                <td align="center" valign="top" style="background: #ffffff">
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    width="100%"
                    style="
                      width: 100% !important;
                      min-width: 100%;
                      max-width: 100%;
                      background: #fece1a;
                    "
                  >
                    <tr>
                      <td align="right" valign="top">
                        <div
                          class="top_pad"
                          style="height: 25px; line-height: 25px; font-size: 23px"
                        >
                          &nbsp;
                        </div>
                      </td>
                    </tr>
                  </table>
                  
            ${body}

                  <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    width="90%"
                    style="
                      width: 90% !important;
                      min-width: 90%;
                      max-width: 90%;
                      border-width: 1px;
                      border-style: solid;
                      border-color: #e8e8e8;
                      border-bottom: none;
                      border-left: none;
                      border-right: none;
                    ">
                    <tr>
                      <td align="left" valign="top">
                        <div
                          style="height: 15px; line-height: 15px; font-size: 13px"
                        >
                          &nbsp;
                        </div>
                      </td>
                    </tr>
                  </table>
  
                 ${prefoother}
                   
                 ${foother}
                </td>
                <td
                  class="mob_pad"
                  width="25"
                  style="width: 25px; max-width: 25px; min-width: 25px"
                >
                  &nbsp;
                </td>
              </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
           </td></tr>
           </table><![endif]-->
          </td>
        </tr>
      </table>
    </body>
  </html>  
    `
}

module.exports = Wrapper1