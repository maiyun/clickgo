import * as datetime from "../libs/date";

export let data = {
    list: []
};
export let methods = {
    onReady: function(this: any) {
        this.list.push(datetime.date() + " - onReady");
    },
    onOpen: async function(this: any) {
        this.list.push(datetime.date() + " - onOpen");
    }
};