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
    },
    confirm: async function(this: IVueForm, cancel: boolean = false): Promise<void> {
        this.result = await this.cgConfirm('Hello world?', cancel);
        if (typeof this.result === 'boolean') {
            this.result = this.result ? 'true (boolean)' : 'false (boolean)';
        }
        else {
            this.result = this.result + ' (number)';
        }
    }
};
