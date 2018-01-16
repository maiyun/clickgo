import * as datetime from "../libs/date";

export let data = {
    list: []
};
export let methods = {
    elOpen: function(this: Vue) {
        this.$data.list.push(datetime.date());
    }
};