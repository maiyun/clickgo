import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'position': 'bottom',
        'mode': 'bar',
        'margin': 8,
        'showDate': true
    };

    public date: string = '00:00';

    /** --- 当日本地零点，仅在跨日时触发日期格式重新计算 --- */
    public dayTime: number = new Date().setHours(0, 0, 0, 0);

    /** --- 使用框架语言标签格式化月日，语言切换时同步更新 --- */
    public get calendarDate(): string {
        return new Date(this.dayTime).toLocaleDateString(this.localeTag, {
            'calendar': 'gregory',
            'month': 'short',
            'day': 'numeric'
        });
    }

    /** --- 从当前语言的日期时间组合格式读取顺序，而非按文字方向猜测 --- */
    public get timeFirst(): boolean {
        const parts = new Intl.DateTimeFormat(this.localeTag, {
            'calendar': 'gregory',
            'month': 'short',
            'day': 'numeric',
            'hour': '2-digit',
            'minute': '2-digit',
            'hourCycle': 'h23'
        }).formatToParts(new Date(this.dayTime));
        const date = parts.findIndex((part) => (part.type === 'month') || (part.type === 'day'));
        const time = parts.findIndex((part) => (part.type === 'hour') || (part.type === 'minute'));
        return time < date;
    }

    /** --- Dock 使用自然尺寸，视窗边距与框架定位保持一致 --- */
    public get dockMargin(): number {
        const margin = this.propNumber('margin');
        return Number.isFinite(margin) ? Math.max(0, margin) : 0;
    }

    public down(e: PointerEvent): void {
        if (!this.slots['pop']) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        clickgo.modules.pointer.menu(e, () => {
            clickgo.form.showPop(this.element, this.refs.pop, e);
        });
    }

    public onMounted(): void | Promise<void> {
        const date = new Date();
        clickgo.task.createTimer(this, () => {
            date.setTime(Date.now());
            const h = date.getHours().toString();
            const m = date.getMinutes().toString();
            this.date = (h.length === 1 ? '0' : '') + h + ':' + (m.length === 1 ? '0' : '') + m;
            this.dayTime = date.setHours(0, 0, 0, 0);
        }, 200, {
            'immediate': true
        });
    }

}
