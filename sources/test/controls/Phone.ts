export let data = {
    list: []
};

export let methods = {
    action: function(this: any, name: string, item: string[], index: number) {
        switch (name) {
        case "Add line":
            this.list.push([]);
            break;
        case "Remove line":
            this.list.splice(index, 1);
            break;
        case "Add Button":
            item.push("1");
            break;
        }
    }
}