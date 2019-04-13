import * as DeskRT from "deskrt";

export let data = {
    price: "3491.12",
    sms: "99998",
    smsy: "993",
    list: [{
        type: "Type1",
        name: "One, One, One",
        time: "2018-01-16 16:41"
    }, {
        type: "Type1",
        name: "Two, Two, Two",
        time: "2018-01-16 14:00"
    }],
    themeName: "chalk"
};

export let methods = {
    // --- 更改主题 ---
    changeTheme: function(this: any, name: string) {
        this.themeName = name;
        if (name === "chalk") {
            DeskRT.setTheme("");
        } else {
            DeskRT.setTheme(name);
        }
    },
    // --- 设置侧边栏 ---
    setAsideWidth: function(this: any, width: string) {
        DeskRT.setAsideWidth(width);
    }
};