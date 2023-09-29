import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public area = 'all';

    public slist = [
        {
            'type': 0,
            'name': 'Appraise',
            'path': 'Bob >> folder >> Appraise',
            'src': '/package/res/r-1.svg'
        },
        {
            'type': 0,
            'name': 'Card',
            'path': 'Bob >> folder >> Card',
            'src': '/package/res/r-2.svg',
            'menu': true
        },
        {
            'type': 0,
            'name': 'Appraise2',
            'path': 'Bob >> folder >> Appraise2',
            'src': '/package/res/r-1.svg',
            'disabled': true
        },
        {
            'control': 'split'
        },
        {
            'type': 1
        }
    ];

    public select: number[] = [];

    public slist2 = [
        'haha1', 'haha2', 'haha3', 'haha4', {
            'value': 'ha5',
            'label': 'The value is ha5'
        }, {
            'value': 'ha6',
            'label': 'Can not be selected',
            'disabled': true
        }, {
            'value': 'title',
            'children': [
                {
                    'label': 'sub1label'
                }, {
                    'label': 'sub2'
                }, {
                    'label': 'Sub title',
                    'children': ['1', '2']
                }
            ]
        }, {
            'label': 'happy',
            'children': ['xixi', 'xixida', 'gogogo']
        }
    ];

    public slist2r: any[] = [];

    public select2 = ['haha2'];

    public aemodel = [];

    public label2 = [];

    public select3 = [];

    public label3 = [];

    public s3other = false;

    public slist3r: any[] = ['a', 'b', 'c', 'haha3'];

    // --- 操作 ---

    public padding = false;

    public fontSize = false;

    public background = false;

    public disabled = false;

    public multi = false;

    public editable = false;

    public tree = false;

    public async = false;

    public icon = false;

    public remote = false;

    public remoteDelay = [0];

    // --- size 高度 ---
    public get sizes(): any {
        const rtn: any = {};
        for (let i = 0; i < this.slist.length; ++i) {
            if (this.slist[i].control === 'split') {
                rtn[i] = 3;
                continue;
            }
            if (this.slist[i].type === 1) {
                rtn[i] = 31;
                continue;
            }
        }
        return rtn;
    }

    public async onLoad(value: string, resolve: (child?: any[]) => void): Promise<void> {
        if (value !== 'haha4') {
            await clickgo.tool.sleep(100);
            if (value === 'haha2') {
                resolve(['60']);
            }
            else {
                resolve();
            }
            return;
        }
        await clickgo.tool.sleep(300);
        resolve(['he', 'ha']);
    }

    public async onLoaded(): Promise<void> {
        await clickgo.form.dialog('done');
    }

    public async onRemote(value: string, resolve: () => void): Promise<void> {
        await clickgo.tool.sleep(300);
        if (value === '8') {
            this.slist2r = [];
            resolve();
            return;
        }
        this.slist2r = ['test', value, 'remote', {
            'label': 'label',
            'value': 'ok'
        }, {
            'label': 'label2',
            'value': 2
        }];
        resolve();
    }

    public onMounted(): void {
        this.watch(() => this.select.join(','), (n, o): void => {
            let select: number[] = [];
            const now = n.split(',');
            const old = o.split(',');
            for (const item of now) {
                if (this.slist[parseInt(item)].type !== 0) {
                    continue;
                }
                select.push(parseInt(item));
            }
            if (select.length === now.length) {
                return;
            }
            select = [];
            for (const item of old) {
                select.push(parseInt(item));
            }
            this.select = select;
        }, {
            'deep': true
        });
    }

}
