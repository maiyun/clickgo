import * as clickgo from 'clickgo';

interface IDockInstance {
    'floatGroup': number;
}

/** --- 同一窗体内的 Dock 实例注册表，确保同时只有一个浮动面板打开 --- */
const formDocks = new WeakMap<object, Set<IDockInstance>>();

export default class extends clickgo.control.AbstractControl implements IDockInstance {

    public emits = {
        'update:expanded': null
    };

    public props: {
        'expanded': boolean | string;
        'width': number | string;
    } = {
            'expanded': true,
            'width': 280
        };

    /** --- 当前是否展开 --- */
    public expandedData: boolean = true;

    /** --- 浮动面板当前指向的 group 索引，-1 表示关闭 --- */
    public floatGroup: number = -1;

    /** --- 展开时的宽度 --- */
    public get widthComp(): string {
        if (typeof this.props.width === 'number') {
            return `${this.props.width}px`;
        }
        if (/^\d+$/.test(this.props.width)) {
            return `${this.props.width}px`;
        }
        return this.props.width;
    }

    /** --- 切换展开/收起 --- */
    public toggle(): void {
        this.expandedData = !this.expandedData;
        this.emit('update:expanded', this.expandedData);
        if (!this.expandedData) {
            this.floatGroup = -1;
        }
    }

    /**
     * --- 收起模式下打开或关闭浮动分组 ---
     * @param groupIndex 分组索引
     */
    public toggleFloat(groupIndex: number): void {
        if (this.floatGroup === groupIndex) {
            this.floatGroup = -1;
            return;
        }
        const siblings = formDocks.get(this.rootForm);
        if (siblings) {
            for (const dock of siblings) {
                if (dock !== this) {
                    dock.floatGroup = -1;
                }
            }
        }
        this.floatGroup = groupIndex;
    }

    /** --- 关闭浮动面板 --- */
    public closeFloat(): void {
        this.floatGroup = -1;
    }

    public onMounted(): void {
        const form = this.rootForm;
        if (!formDocks.has(form)) {
            formDocks.set(form, new Set());
        }
        formDocks.get(form)!.add(this);

        this.watch('expanded', () => {
            this.expandedData = this.propBoolean('expanded');
            if (!this.expandedData) {
                this.floatGroup = -1;
            }
        }, {
            'immediate': true
        });
    }

    public onUnmounted(): void {
        const siblings = formDocks.get(this.rootForm);
        siblings?.delete(this);
        if (!siblings?.size) {
            formDocks.delete(this.rootForm);
        }
    }

}
