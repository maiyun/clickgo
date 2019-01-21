import * as datetime from "../libs/date";

export let data = {
    list: []
};
export let methods = {
    onOpen: function(this: Vue) {
        this.$data.list.push(datetime.date());
    }
};