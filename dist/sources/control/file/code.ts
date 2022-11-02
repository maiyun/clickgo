import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'accept': undefined,
        'multi': false,
        'dir': false
    };

    public get isMulti(): boolean {
        return clickgo.tool.getBoolean(this.props.multi);
    }

    public get isDir(): boolean {
        return clickgo.tool.getBoolean(this.props.dir);
    }

    public get acceptComp(): string | undefined {
        if (!this.props.accept) {
            return undefined;
        }
        if (!Array.isArray(this.props.accept)) {
            return undefined;
        }
        const accept: string[] = [];
        for (const item of this.props.accept as any[]) {
            if (typeof item !== 'string') {
                continue;
            }
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
        this.emit('change', inputEl.files);
        inputEl.value = '';
    }

}
