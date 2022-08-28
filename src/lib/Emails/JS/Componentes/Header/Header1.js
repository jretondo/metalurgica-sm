const Header1 = (logo) => {
    return (
        `
        <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        width="88%"
        style="
        width: 88% !important;
        min-width: 88%;
        max-width: 88%;
        background-color: 525f7f;
        padding: 30px;
        ">
        <tr>
        <td align="center" valign="top">
            <a
            href="https://nekonet.com.ar"
            target="_blank"
            style="display: block"
            >
            <img
                src="${logo}"
                alt="img"
                width="300"
                border="0"
                style="display: block; width: 300px"
            />
            </a>
        </td>
        </tr>
        </table>
    `
    )
}

module.exports = Header1