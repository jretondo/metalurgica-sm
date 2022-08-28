function formatDate(date) {
    const month = parseInt(date.getMonth() + 1)
    const year = date.getFullYear().toString().substr(-2)
    let monthStr
    if (month === 1) {
        monthStr = "Ene"
    } else if (month === 2) {
        monthStr = "Feb"
    } else if (month === 3) {
        monthStr = "Mar"
    } else if (month === 4) {
        monthStr = "Abr"
    } else if (month === 5) {
        monthStr = "May"
    } else if (month === 6) {
        monthStr = "jun"
    } else if (month === 7) {
        monthStr = "Jul"
    } else if (month === 8) {
        monthStr = "Ago"
    } else if (month === 9) {
        monthStr = "Sep"
    } else if (month === 10) {
        monthStr = "Oct"
    } else if (month === 12) {
        monthStr = "Nov"
    } else if (month === 12) {
        monthStr = "Dic"
    } else {
        monthStr = "Ene"
    }

    return monthStr + "/" + year
}

module.exports = formatDate