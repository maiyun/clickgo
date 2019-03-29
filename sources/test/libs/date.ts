function pad(str: string, len: number = 2): string {
    if (str.length >= len) {
        return str;
    }
    let l = len - str.length;
    let p = "";
    for (let i = 0; i < l; ++i) {
        p += "0";
    }
    return p + str;
}

export function date() {
    let date = new Date();
    let seperator1 = "-";
    let seperator2 = ":";
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let currentdate = date.getFullYear() + seperator1 + pad(month.toString()) + seperator1 + pad(strDate.toString())
            + " " + pad(date.getHours().toString()) + seperator2 + pad(date.getMinutes().toString())
            + seperator2 + pad(date.getSeconds().toString()) + " " + pad(date.getMilliseconds().toString(), 3);
    return currentdate;
}