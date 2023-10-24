import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public select: number[] = [];

    public list = [
        {
            'icon': 'https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/res/sql.svg'
        },
        {
            'icon': 'https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/res/txt.svg'
        },
        {
            'icon': 'https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/res/zip.svg'
        },
        {
            'icon': 'https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/res/img.jpg'
        }
    ];

    public selectClick(): void {
        this.dialogResult = this.list[this.select[0]].icon.slice(-11);
        this.close();
    }

}
