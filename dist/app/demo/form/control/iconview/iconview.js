import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    list = [
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
    select = [];
    // --- 操作 ---
    custom = false;
    disabled = false;
    must = false;
    multi = true;
    ctrl = true;
    selection = true;
    gesture = false;
    name = true;
    selectionArea = {};
    scroll = 'auto';
    size = [100];
    plain = false;
    showIndex() {
        clickgo.form.dialog(this, 'Index is ' + this.select.toString() + '.').catch((e) => { throw e; });
    }
    showType() {
        if (this.select.length === 0) {
            clickgo.form.dialog(this, 'There are currently no selected items.').catch((e) => { throw e; });
        }
        else {
            const types = [];
            for (const item of this.select) {
                types.push(this.list[item].type);
            }
            clickgo.form.dialog(this, `Type is ${JSON.stringify(types)}.`).catch((e) => { throw e; });
        }
    }
    // --- 添加按钮 ---
    add() {
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
    async remove() {
        if (this.list.length === 3) {
            await clickgo.form.dialog(this, 'It cannot be removed at this time.');
            return;
        }
        this.list.splice(-1, 1);
    }
    async drop(e) {
        await clickgo.form.dialog(this, JSON.stringify(e.detail));
    }
    onSelect(e) {
        this.selectionArea = e.detail.area;
    }
    async onOpen(e) {
        await clickgo.form.dialog(this, 'onOpen: ' + e.detail.value.toString());
    }
    scrollChange() {
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
    async onGesture(dir) {
        await clickgo.form.dialog(this, 'onGesture: ' + dir);
    }
}
