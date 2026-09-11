import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'input': null,
        'change': null,
        'update:modelValue': null
    };
    props = {
        'disabled': false,
        'label': '',
        'max': 100,
        'min': 0,
        'modelValue': 0,
        'showValue': false,
        'size': 'm',
        'step': 1
    };
    /** --- 有效最小值 --- */
    get minComp() {
        const min = this.propNumber('min');
        return Number.isFinite(min) ? min : 0;
    }
    /** --- 有效最大值，不小于最小值 --- */
    get maxComp() {
        const max = this.propNumber('max');
        return Number.isFinite(max) ? Math.max(this.minComp, max) : Math.max(this.minComp, 100);
    }
    /** --- 有效步长 --- */
    get stepComp() {
        const step = this.propNumber('step');
        return Number.isFinite(step) && (step > 0) ? step : 1;
    }
    /** --- 修正到范围和步长后的当前值 --- */
    get valueComp() {
        const value = this.propNumber('modelValue');
        const current = Number.isFinite(value) ? value : this.minComp;
        const clamped = Math.min(this.maxComp, Math.max(this.minComp, current));
        const stepped = this.minComp + Math.round((clamped - this.minComp) / this.stepComp) * this.stepComp;
        return Math.min(this.maxComp, Math.max(this.minComp, Number(stepped.toPrecision(12))));
    }
    /** --- 当前值在轨道上的百分比 --- */
    get progressComp() {
        if (this.maxComp === this.minComp) {
            return '0%';
        }
        return `${(this.valueComp - this.minComp) / (this.maxComp - this.minComp) * 100}%`;
    }
    /**
     * --- 拖动时持续更新当前值 ---
     * @param event 输入事件
     */
    input(event) {
        const value = event.target.valueAsNumber;
        this.emit('update:modelValue', value);
        this.emit('input', value);
    }
    /**
     * --- 操作完成时提交当前值 ---
     * @param event 变更事件
     */
    change(event) {
        this.emit('change', event.target.valueAsNumber);
    }
}
