import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.form.AbstractForm {

    public list = [
        {
            'id': '1',
            'type': 0,
            'name': 'Folder',
            'time': 1676636097
        },
        {
            'id': '2',
            'type': 0,
            'name': 'Folder2',
            'time': 1676636097
        },
        {
            'id': '3',
            'type': 1,
            'name': 'File1',
            'time': 1676600096
        },
        {
            'id': '4',
            'type': 1,
            'name': 'db.sql',
            'time': 1676600097,
            'icon': '/package/res/sql.svg'
        },
        {
            'id': '5',
            'type': 1,
            'name': 'article.txt',
            'time': 1676600098,
            'icon': '/package/res/txt.svg'
        },
        {
            'id': '6',
            'type': 1,
            'name': 'pack.zip',
            'time': 1676600099,
            'icon': '/package/res/zip.svg'
        },
        {
            'id': '7',
            'type': 1,
            'name': 'packlonglonglonglonglonglonglonglonglong.zip',
            'time': 1676700099,
            'icon': '/package/res/zip.svg'
        },
        {
            'id': 7,
            'icon': 'https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/res/img.jpg'
        }
    ];

    public select: number[] = [];

    // --- 操作 ---

    public disabled = false;

    public must = false;

    public multi = true;

    public ctrl = true;

    public selection = true;

    public gesture = false;

    public name = true;

    public selectionArea = {};

    public scroll = 'auto';

    public size = [100];

    public showIndex(): void {
        clickgo.form.dialog('Index is ' + this.select.toString() + '.').catch((e: Error) => { throw e; });
    }

    public showType(): void {
        if (this.select.length === 0) {
            clickgo.form.dialog('There are currently no selected items.').catch((e: Error) => { throw e; });
        }
        else {
            const types = [];
            for (const item of this.select) {
                types.push(this.list[item].type);
            }
            clickgo.form.dialog(`Type is ${types}.`).catch((e: Error) => { throw e; });
        }
    }

    // --- 添加按钮 ---
    public add(): void {
        if (clickgo.tool.rand(0, 1)) {
            // --- 文件 ---
            this.list.push({
                'id': this.list.length.toString(),
                'type': 1,
                'name': 'File' + this.list.length.toString(),
                'time': Math.floor(Date.now() / 1000)
            });
        }
        else {
            // --- 文件夹 ---
            this.list.unshift({
                'id': this.list.length.toString(),
                'type': 0,
                'name': 'Folder' + this.list.length.toString(),
                'time': Math.floor(Date.now() / 1000)
            });
        }
    }

    public async remove(): Promise<void> {
        if (this.list.length === 3) {
            await clickgo.form.dialog('It cannot be removed at this time.');
            return;
        }
        this.list.splice(-1, 1);
    }

    public async drop(e: types.IIconviewDropEvent): Promise<void> {
        await clickgo.form.dialog(JSON.stringify(e.detail));
    }

    public onSelect(e: types.IIconviewSelectEvent): void {
        this.selectionArea = e.detail.area;
    }

    public async onOpen(e: types.IIconviewOpenEvent): Promise<void> {
        await clickgo.form.dialog('onOpen: ' + e.detail.value.toString());
    }

    public scrollChange(): void {
        switch (this.scroll) {
            case 'auto': {
                this.scroll = 'visible';
                break;
            }
            case 'visible': {
                this.scroll = 'hidden';
                break;
            }
            default: {
                this.scroll = 'auto';
            }
        }
    }

    public async onGesture(dir: string): Promise<void> {
        await clickgo.form.dialog('onGesture: ' + dir);
    }

}
