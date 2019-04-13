import * as DeskRT from "deskrt";

export let data = {
    username: "DeskUI"
};

export let methods = {
    setLocale: function(l: string) {
        DeskRT.setLocale(l);
    }
};