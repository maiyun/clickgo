export const data = {
    'result': 'None'
};

export const methods = {
    dialog: async function(this: IVForm, opt: string | ICGFormDialog): Promise<void> {
        this.result = await this.cgDialog(opt);
    },
    donot: async function(this: IVForm): Promise<void> {
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
    confirm: async function(this: IVForm, cancel: boolean = false): Promise<void> {
        this.result = await this.cgConfirm('Hello world?', cancel);
        if (typeof this.result === 'boolean') {
            this.result = this.result ? 'true (boolean)' : 'false (boolean)';
        }
        else {
            this.result = (this.result as number).toString() + ' (number)';
        }
    }
};
