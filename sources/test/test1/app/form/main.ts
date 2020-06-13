export let data = {
    "width": 300,
    "height": 505
};

export let methods = {
    openOnlyClose: function(this: IVue): void {
        this.createForm("/form/onlyClose");
    },
    openThin: function(this: IVue): void {
        this.createForm("/form/thin");
    },
    openError: function(this: IVue): void {
        this.createForm("/form/error");
    },
    openBorderNone: function(this: IVue): void {
        this.createForm("/form/borderNone");
    },
    openAero: function(this: IVue): void {
        this.createForm("/form/aero");
    },
    openMax: function(this: IVue): void {
        this.createForm("/form/max");
    },
    openMove: function(this: IVue): void {
        this.createForm("/form/move");
    },
    openScroll: function(this: IVue): void {
        this.createForm("/form/scroll");
    },
    openView: function(this: IVue): void {
        this.createForm("/form/view");
    },
    runTaskmgr: async function(this: IVue): Promise<void> {
        await ClickGo.runApp("taskApp/");
    }
};

