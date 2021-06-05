export let data = {
    'result': 'None'
};

export let methods = {
    dialog: async function(this: IVueForm, opt: string | ICGFormDialog): Promise<void> {
        this.result = await this.cgDialog(opt);
    },
    donot: async function(this: IVueForm): Promise<void> {
        this.result = await this.cgDialog({
            'content': 'Hello world!',
            'buttons': ['Do not close', 'Close'],
            'select': (e: Event, button: string): void => {
                if (button === 'Do not close') {
                    e.preventDefault();
                }
            }
        });
    }
};
