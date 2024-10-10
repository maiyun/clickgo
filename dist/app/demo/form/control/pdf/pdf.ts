import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.form.AbstractForm {

    public access: {
        'pdf': any;
    } = {
            'pdf': undefined
        };

    public src: string = '';

    public page: string = '1';

    public onLoaded(pdf: Record<string, any>): void {
        this.access.pdf = pdf;
    }

    public async onView(e: types.IPdfViewEvent): Promise<void> {
        await clickgo.form.dialog(JSON.stringify(e.detail));
    }

    // --- 加载 pdf ---
    public load(): void {
        this.src = '/package/form/control/pdf/test.pdf';
    }

    public select(): void {
        this.refs.file.select();
    }

    public async change(files: FileList | null): Promise<void> {
        if (!files) {
            return;
        }
        await this.refs.pdf.load(files[0]);
    }

}
