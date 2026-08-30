import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'name': '',
        'label': '',
        'icon': '',
        'lazy': true,
        'cache': true
    };
    /** --- 父级 Dock Group --- */
    group = null;
    /** --- 是否已挂载过内容 --- */
    loadedData = false;
    /** --- 是否处于选中状态 --- */
    get isSelected() {
        return this.group?.selectedData === this.props.name;
    }
    /** --- 当前是否需要渲染 slot 内容 --- */
    get shouldRender() {
        if (!this.propBoolean('lazy') || this.isSelected) {
            return true;
        }
        return this.propBoolean('cache') && this.loadedData;
    }
    onMounted() {
        this.group = this.parentByName('dock-group');
        this.watch(() => this.isSelected, active => {
            if (active) {
                this.loadedData = true;
            }
        }, {
            'immediate': true
        });
    }
}
