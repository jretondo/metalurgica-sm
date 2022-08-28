function CalcPaquetes(Req) {

    function ArrayC(l1, l2, l3, w, name) {
        let arr = [l1, l2, l3].sort(function (a, b) {
            return b - a;
        });
        arr.push(w);
        arr.push(name);
        return arr;
    }


}

module.exports = CalcPaquetes