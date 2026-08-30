import * as clickgo from 'clickgo';

type TDockGroup = clickgo.control.AbstractControl & {
    'selectedData': string;
};

export default class extends clickgo.control.AbstractControl {

    public props: {
        'name': string;
        'label': string;
        'icon': string;
        'lazy': boolean | string;
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
