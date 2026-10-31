import * as clickgo from 'clickgo';
import * as runtime from './lib/runtime';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:modelValue': null,
        'beforechange': null,
        'changed': null,
    };
    props = {
        'modelValue': [],
        'multiple': false,
        'disabled': false,
        'level': 3,
    };
    /** --- 当前实例持有的直属子项 --- */
    access = {
        'items': null,
    };
    /** --- 当前展开项，未知 name 保留 --- */
    value = [];
    /** --- 当前标题使用的无障碍层级 --- */
    get ariaLevel() {
        const value = Number(this.props.level);
        return Number.isFinite(value) ? Math.min(6, Math.max(1, Math.trunc(value))) : 3;
    }
    /**
     * --- 注册直属子项 ---
     * @param item 子项
     * @returns 注册完成
     */
    register(item) {
        if (item.element.parentElement === this.refs.list) {
            item.id ||= runtime.createId();
            this.access.items?.set(item.element, item);
        }
    }
    /**
     * --- 注销子项 ---
     * @param item 子项
     * @returns 注销完成
     */
    unregister(item) {
        this.access.items?.delete(item.element);
    }
    /**
     * --- 由用户切换子项，允许 beforechange 取消 ---
     * @param item 子项
     * @returns 切换处理完成
     */
    toggle(item) {
        runtime.toggle(this, item);
    }
    /**
     * --- 按当前 DOM 顺序移动标题焦点 ---
     * @param item 当前子项
     * @param key 方向或边界按键
     * @returns 焦点处理完成
     */
    move(item, key) {
        runtime.move(this, item, key);
    }
    /**
     * --- 初始化子项表 ---
     * @returns 初始化完成
     */
    onCreated() {
        this.access.items = new Map();
    }
    /**
     * --- 同步外部展开项与模式 ---
     * @returns 监听安装完成
     */
    onMounted() {
        this.watch('modelValue', () => {
            const value = runtime.normalize(this.props.modelValue, this.propBoolean('multiple'));
            this.value = value;
            if (value.length !== this.props.modelValue.length ||
                value.some((name, index) => name !== this.props.modelValue[index])) {
                this.emit('update:modelValue', [...value]);
            }
        }, { 'immediate': true, 'deep': true });
        this.watch('multiple', () => {
            const value = runtime.normalize(this.value, this.propBoolean('multiple'));
            if (value.length !== this.value.length || value.some((name, index) => name !== this.value[index])) {
                this.value = value;
                this.emit('update:modelValue', [...value]);
            }
        });
    }
    /**
     * --- 释放子项引用 ---
     * @returns 清理完成
     */
    onBeforeUnmount() {
        this.access.items = null;
    }
}
