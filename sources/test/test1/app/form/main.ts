export let data = {
    'width': 300,
    'height': 505,

    'theme': ''
};

export let methods = {
    openOnlyClose: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/onlyClose');
    },
    openThin: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/thin');
    },
    openBorderNone: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/borderNone');
    },
    openAero: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/aero');
    },
    openMax: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/max');
    },
    openMove: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/move');
    },
    openScroll: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/scroll');
    },
    openView: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/view');
    },
    openMenu: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/menu');
    },
    openGreatView: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/greatview');
    },
    openOverflow: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/overflow');
    },
    runTaskmgr: async function(this: IVueForm): Promise<void> {
        await clickgo.task.run('taskApp/');
    },
    changeTheme: async function(this: IVueForm): Promise<void> {
        if (this.theme === '') {
            this.theme = 'once';
            await this.cgSetTheme('/clickgo/theme/once.cgt');
        }
        else {
            this.theme = '';
            await this.cgClearTheme();
        }
    },
    openError: async function(this: IVueForm): Promise<void> {
        await this.cgCreateForm('/form/error');
    }
};
