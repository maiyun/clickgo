export let data = {
    list: []
};

export let methods = {
    action: function(this: any, name: string, list: any[], item: string[], index: number) {
        switch (name) {
        case "Add line":
            list.splice(index + 1, 0, []);
            break;
        case "Remove line":
            list.splice(index, 1);
            break;
        case "Add Button":
            item.push("1");
            break;
        }
    }
}