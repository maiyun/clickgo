import * as datetime from "../libs/date";

export let data = {
    list: []
};
export let methods = {
    onReady: function(this: Vue) {
        this.$data.list.push(datetime.date());
    }
};