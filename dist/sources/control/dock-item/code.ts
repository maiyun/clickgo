import * as clickgo from 'clickgo';

type TDockGroup = clickgo.control.AbstractControl & {
    'selectedData': string;
};

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- name，当前内容项在 Dock Group 中的唯一名称 --- */
        'name': string;
        /** --- label，当前内容项在标签栏或浮动面板中显示的名称 --- */
        'label': string;
        /** --- icon，Dock 收起时当前内容项显示的图标路径 --- */
        'icon': string;
        /** --- lazy，是否在当前内容项首次选中时才挂载内容 --- */
        'lazy': boolean | string;
        /** --- cache，当前内容项切换隐藏后是否保留已挂载内容 --- */
        'cache': boolean | string;
    } = {
            'name': '',
            'label': '',
            'icon': '',
            'lazy': true,
            'cache': true
        };

    /** --- 父级 Dock Group --- */
    public group: TDockGroup | null = null;

    /** --- 是否已挂载过内容 --- */
    public loadedData: boolean = false;

    /** --- 是否处于选中状态 --- */
    public get isSelected(): boolean {
        return this.group?.selectedData === this.props.name;
    }

    /** --- 当前是否需要渲染 slot 内容 --- */
    public get shouldRender(): boolean {
        if (!this.propBoolean('lazy') || this.isSelected) {
            return true;
        }
        return this.propBoolean('cache') && this.loadedData;
    }

    public onMounted(): void {
        this.group = this.parentByName('dock-group') as TDockGroup | null;
        this.watch(() => this.isSelected, active => {
            if (active) {
                this.loadedData = true;
            }
        }, {
            'immediate': true
        });
    }

}
