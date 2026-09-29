import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:expanded': null
    };
    props = {
        'expanded': true,
        'width': 280,
        'label': ''
    };
    /** --- 所属 Dock，所有列共享浮层调度和 Form 尺寸监听 --- */
    dock = null;
    /** --- 用户的展开偏好与自动收起状态分别保留 --- */
    expandedPreference = true;
    /** --- 当前列是否因布局空间不足而收起 --- */
    autoCollapsed = false;
    /** --- 当前列浮层可使用的内容区高度 --- */
    floatAreaHeight = 0;
    /** --- 展开时的像素宽度 --- */
    get preferredWidth() {
        const width = this.propNumber('width');
        return Number.isFinite(width) && (width > 0) ? Math.max(40, width) : 280;
    }
    get widthComp() {
        return `${this.preferredWidth}px`;
    }
    get expandedData() {
        return (this.dock?.expandedData ?? true) && this.expandedPreference && !this.autoCollapsed;
    }
    get narrow() {
        return (this.dock?.narrow ?? false) || this.autoCollapsed;
    }
    get positionData() {
        return this.dock?.positionData ?? 'right';
    }
    get floatGroup() {
        return this.dock?.floatGroup ?? -1;
    }
    get viewportWidth() {
        return this.dock?.viewportWidth ?? 0;
    }
    get viewportHeight() {
        return this.dock?.viewportHeight ?? 0;
    }
    get formWidth() {
        return this.dock?.formWidth ?? 0;
    }
    /** --- 切换当前列，自动收起时由图标打开浮层 --- */
    toggle() {
        if (this.narrow) {
            return;
        }
        if (this.dock && !this.dock.expandedData) {
            this.dock.toggle();
            return;
        }
        this.expandedPreference = !this.expandedPreference;
        this.dock?.closeFloat();
        this.emit('update:expanded', this.expandedPreference);
    }
    registerGroup() {
        // --- 子分组先于列执行 mounted，索引分配不能等待列的 mounted。 ---
        this.dock ??= this.parentByName('dock');
        return this.dock?.registerGroup() ?? 0;
    }
    unregisterGroup(index) {
        this.dock?.unregisterGroup(index);
    }
    toggleFloat(index) {
        this.dock?.toggleFloat(index);
    }
    getFloatArea() {
        return this.refs.body ?? null;
    }
    getFloatBounds() {
        return this.dock?.getFloatBounds() ?? {
            'left': 0,
            'right': document.documentElement.clientWidth,
            'top': 0,
            'bottom': document.documentElement.clientHeight
        };
    }
    onMounted() {
        this.dock = this.parentByName('dock');
        this.watch('expanded', () => {
            this.expandedPreference = this.propBoolean('expanded');
        }, {
            'immediate': true
        });
        this.dock?.registerColumn(this);
        clickgo.dom.watchSize(this, this.refs.body, () => {
            this.floatAreaHeight = this.refs.body.clientHeight;
        }, true);
    }
    onUnmounted() {
        this.dock?.unregisterColumn(this);
    }
}
