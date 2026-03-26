import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:modelValue': null
    };

    public props: {
        'modelValue': number;
    } = {
            'modelValue': 0
        };

    /** --- 当前选中的 item 索引 --- */
    public selected: number = 0;

    /** --- 父级 sform 控件实例 --- */
    public sform: any = null;

    /** --- 当前 group 在 sform 中的索引 --- */
    public index: number = 0;

    /** --- 是否处于展开模式 --- */
    public get isExpanded(): boolean {
        return this.sform?.expandedData ?? true;
    }

    /** --- 是否正在浮动显示 --- */
    public get isFloating(): boolean {
        return this.sform?.floatGroup === this.index;
    }

    /** --- 浮动面板宽度，来自父级 sform 的 width prop --- */
    public get floatWidth(): string {
        return this.sform?.widthComp ?? '280px';
    }

    /** --- 获取子项信息列表 --- */
    public get items(): Array<{ 'label': string; 'icon': string; }> {
        const list: Array<{ 'label': string; 'icon': string; }> = [];
        const els = this.slotsAll('default');
        for (const el of els) {
            if (!el.props) {
                continue;
            }
            list.push({
                'label': el.props.label ?? '',
                'icon': el.props.icon ?? ''
            });
        }
        return list;
    }

    /**
     * --- 选中某个 item ---
     * @param index 要选中的索引
     */
    public select(index: number): void {
        if (this.selected === index) {
            return;
        }
        this.selected = index;
        this.emit('update:modelValue', this.selected);
    }

    /**
     * --- 收起模式下点击 icon，通知父级 sform 打开浮动面板 ---
     * @param index 点击的 item 索引
     */
    public iconClick(index: number): void {
        if (!this.sform) {
            return;
        }
        this.sform.toggleFloat(this.index, index);
        // --- 如果当前 group 正在浮动，则选中点击的 item ---
        if (this.isFloating) {
            this.select(index);
        }
    }

    /**
     * --- 浮动面板中点击 tab 切换选中项 ---
     * @param index tab 索引
     */
    public floatTabClick(index: number): void {
        this.select(index);
        if (this.sform) {
            this.sform.floatItem = index;
        }
    }

    public onMounted(): void {
        this.sform = this.parentByName('sform');
        if (this.sform) {
            this.index = clickgo.dom.index(this.element);
        }

        this.watch('modelValue', () => {
            const v = Number(this.props.modelValue);
            if (this.selected === v) {
                return;
            }
            this.selected = v;
        }, {
            'immediate': true
        });
    }

}
