import * as clickgo from 'clickgo';
import * as types from '~/types';

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
        'haha1', 'haha2', 'haha3', {
            'label': 'tip',
            'color': 'tip'
        }, 'haha4', {
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
            'children': ['xixi', 'xixida', {
                'value': 'gogogo',
                'children': ['aaa', 'bbb', 'ccc']
            }]
        }
    ];

    /** --- onAdd / onRemove --- */
    public addRemoveList: string[] = [];

    public select2 = ['haha4'];

    public aemodel = [];

    public label2 = [];

    public asyncModel = ['1'];

    public asyncData: Record<string, any> = {};

    public select3 = '';

    public label3 = '';

    public level3 = [];

    public s3other = false;

    public slist3r: any[] = ['a', 'b', 'c', 'haha3'];

    public editableDataValue = ['0'];

    public editableData = {
        '0': ['1', '2', '3', { 'label': 'is gDa', 'value': 'gDa' }, '5'],
        '1': ['6', '7', '8', '9', '10', { 'label': 'But gDa', 'value': 'gDa' }],
        '2': ['11', '12', '13', '14', 'gDa', { 'label': 'Other', 'value': 'o' }],
        '3': []
    };

    public noValue: any[] = [];

    public reward: string[] = ['z'];

    public disabledList: string[] = [];

    public unavailableList: string[] = [];

    // --- 操作 ---

    public padding = ['m'];

    public fontSize = false;

    public background = false;

    public disabled = false;

    public multi = false;

    public search = false;

    public editable = false;

    public tree = false;

    public async = false;

    public icon = false;

    public remote = false;

    public remoteDelay = [0];

    public plain = false;

    public virtual = false;

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

    public onLoaded(): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Levelselect @loaded',
            'content': 'Done'
        });
    }

    public async onRemote(e: types.ISelectRemoteEvent): Promise<void> {
        await clickgo.tool.sleep(300);
        if (!e.detail.value || e.detail.value === '8') {
            await e.detail.callback();
            return;
        }
        await e.detail.callback(['test', e.detail.value, 'remote', {
            'label': 'label',
            'value': 'ok'
        }, {
            'label': 'label2',
            'value': 2
        }]);
    }

    public onGAdd(e: types.IGreatselectAddEvent): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatselect @add',
            'content': 'value: ' + e.detail.value.toString()
        });
        if (this.slist[e.detail.value].type === 1) {
            e.preventDefault();
        }
    }

    public onGRemove(e: types.IGreatselectRemoveEvent): void {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greaselect @remove',
            'content': 'value: ' + e.detail.value.toString()
        });
    }

    public onGChange(e: types.IGreatselectChangeEvent): void {
        console.log('onGChange', e);
    }

    public onGChanged(e: types.IGreatselectChangeEvent): void {
        console.log('onGChanged', e);
    }

    public onAdd(e: types.ISelectAddEvent): void {
        this.addRemoveList.unshift('@add, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value);
    }

    public onAdded(e: types.ISelectAddedEvent): void {
        this.addRemoveList.unshift('@added, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value);
    }

    public onRemove(e: types.ISelectRemoveEvent): void {
        this.addRemoveList.unshift('@remove, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value + ', mode: ' + e.detail.mode);
    }

    public onRemoved(e: types.ISelectRemovedEvent): void {
        this.addRemoveList.unshift('@removed, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value + ', mode: ' + e.detail.mode);
    }

    public onChange(e: types.ISelectChangeEvent): void {
        console.log('onChange', e);
        if (e.detail.value[0] === 'title') {
            e.preventDefault();
        }
    }

    public onChanged(e: types.ISelectChangedEvent): void {
        console.log('onChanged', e);
    }

    public onTagclick(e: types.ISelectTagclickEvent): void {
        this.addRemoveList.unshift('@tagclick, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value);
    }

    public changeArea(): void {
        switch (this.area) {
            case 'all': {
                this.area = 'arrow';
                break;
            }
            case 'arrow': {
                this.area = 'text';
                break;
            }
            default: {
                this.area = 'all';
            }
        }
    }

    /** --- 异步加载按钮 --- */
    public asyncLoad(): void {
        const list = ['0', {
            'label': 'ok',
            'value': '1'
        }, '2', '3'];
        for (let i = 0; i < list.length; ++i) {
            this.asyncData[i.toString()] = list[i];
        }
        this.asyncModel[0] = '1';
    }

    public onMounted(): void {
        this.watch(() => this.select.join(','), (n, o): void => {
            if (this.multi) {
                return;
            }
            if (this.slist[parseInt(n)].type === 0) {
                return;
            }
            this.select = [parseInt(o)];
        });
    }

}
