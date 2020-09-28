export let data = {
    'width': 300,
    'height': 505,

    'theme': ''
};

export let methods = {
    openOnlyClose: function(this: IVue): void {
        this.createForm('/form/onlyClose');
    },
    openThin: function(this: IVue): void {
        this.createForm('/form/thin');
    },
    openBorderNone: function(this: IVue): void {
        this.createForm('/form/borderNone');
    },
    openAero: function(this: IVue): void {
        this.createForm('/form/aero');
    },
    openMax: function(this: IVue): void {
        this.createForm('/form/max');
    },
    openMove: function(this: IVue): void {
        this.createForm('/form/move');
    },
    openScroll: function(this: IVue): void {
        this.createForm('/form/scroll');
    },
    openView: function(this: IVue): void {
        this.createForm('/form/view');
    },
    openMenu: function(this: IVue): void {
        this.createForm('/form/menu');
    },
    openGreatView: function(this: IVue): void {
        this.createForm('/form/greatview');
    },
    openOverflow: function(this: IVue): void {
        this.createForm('/form/overflow');
    },
    runTaskmgr: async function(this: IVue): Promise<void> {
        await clickgo.core.runApp('taskApp/');
    },
    changeTheme: async function(this: IVue): Promise<void> {
        if (this.theme === '') {
            this.theme = 'once';
            await clickgo.theme.setGlobal('/clickgo/theme/once.cgt');
        }
        else {
            this.theme = '';
            await clickgo.theme.clearGlobal();
        }
    },
    openError: function(this: IVue): void {
        this.createForm('/form/error');
    }
};
