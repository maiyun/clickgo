import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'accept': string[] | string;
        'multi': boolean | string;
        'dir': boolean | string;
    } = {
            'accept': [],
            'multi': false,
            'dir': false
        };

    public get acceptComp(): string | undefined {
        const accept: string[] = [];
        for (const item of this.propArray('accept')) {
            accept.push('.' + item);
        }
        return accept.join(',');
    }

    // --- method ---

    public select(): void {
        this.refs.input.click();
    }

    public change(e: InputEvent): void {
        e.stopPropagation();
        const inputEl = this.refs.input as unknown as HTMLInputElement;
        const files: File[] = [];
        if (inputEl.files) {
            for (const file of inputEl.files) {
                files.push(file);
            }
        }
        this.emit('change', files);
        inputEl.value = '';
    }

}
