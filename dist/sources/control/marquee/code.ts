import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        /** --- 滚动方向 --- */
        'direction': 'left' | 'right' | 'top' | 'bottom';

        'speed': number | string;
    } = {
            'direction': 'left',

            'speed': 1
        };

    public padding = '';

    public left = 0;

    public top = 0;

    public client = 0;

    public length = 0;

    public timer = 0;

    public ani = false;

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    public get speedPx(): number {
        return this.propInt('speed') * 0.8;
    }

    public refresh(): void {
        this.ani = false;
        if (this.length === 0 || this.client === 0) {
            return;
        }
        if (this.length > this.client) {
            // --- 超出，得滚动 ---
            if (this.timer > 0) {
                return;
            }
            switch (this.props.direction) {
                case 'left': {
                    this.left = 0;
                    this.top = 0;
                    break;
                }
                case 'right': {
                    this.left = -(this.length - this.client);
                    this.top = 0;
                    break;
                }
                case 'top': {
                    this.left = 0;
                    this.top = 0;
                    break;
                }
                case 'bottom': {
                    this.left = 0;
                    this.top = -(this.length - this.client);
                    break;
                }
            }
        }
        else {
            // --- 未超出、无需滚动 ---
            if (this.timer === 0) {
                return;
            }
            clickgo.task.offFrame(this.timer);
            this.timer = 0;
            this.left = 0;
            this.top = 0;
            return;
        }
        clickgo.task.sleep(() => {
            if (this.length <= this.client) {
                return;
            }
            if (this.timer > 0) {
                return;
            }
            // --- 没创建的 timer 的现在创建 timer ---
            this.timer = clickgo.task.onFrame(async () => {
                if (!this.element.offsetParent) {
                    clickgo.task.offFrame(this.timer);
                    this.timer = 0;
                    return;
                }
                // --- 超出才滚动 ---
                const xv = this.length - this.client;
                switch (this.props.direction) {
                    case 'left': {
                        if (this.left === -xv) {
                            this.left = 0;
                            clickgo.task.sleep(() => {
                                this.ani = false;
                            }, 150);
                            await clickgo.tool.sleep(1000);
                        }
                        else {
                            this.left -= this.speedPx;
                            if (this.left < -xv) {
                                this.left = -xv;
                                this.ani = true;
                                await clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                    case 'right': {
                        if (this.left === 0) {
                            this.left = -xv;
                            clickgo.task.sleep(() => {
                                this.ani = false;
                            }, 150);
                            await clickgo.tool.sleep(1000);
                        }
                        else {
                            this.left += this.speedPx;
                            if (this.left > 0) {
                                this.left = 0;
                                this.ani = true;
                                await clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                    case 'top': {
                        if (this.top === -xv) {
                            this.top = 0;
                            clickgo.task.sleep(() => {
                                this.ani = false;
                            }, 150);
                            await clickgo.tool.sleep(1000);
                        }
                        else {
                            this.top -= this.speedPx;
                            if (this.top < -xv) {
                                this.top = -xv;
                                this.ani = true;
                                await clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                    case 'bottom': {
                        if (this.top === 0) {
                            this.top = -xv;
                            clickgo.task.sleep(() => {
                                this.ani = false;
                            }, 150);
                            await clickgo.tool.sleep(1000);
                        }
                        else {
                            this.top += this.speedPx;
                            if (this.top > 0) {
                                this.top = 0;
                                this.ani = true;
                                await clickgo.tool.sleep(1000);
                            }
                        }
                        break;
                    }
                }
            }, {
                'formId': this.formId
            });
        }, 1000);
    }

    public onMounted(): void | Promise<void> {
        this.watch('direction', (n, o): void => {
            if (this.timer === 0) {
                return;
            }
            const ndir = (n === 'left' || n === 'right') ? 'h' : 'v';
            const odir = (o === 'left' || o === 'right') ? 'h' : 'v';
            if (ndir === odir) {
                return;
            }
            if (ndir === 'v') {
                this.left = 0;
            }
            else {
                this.top = 0;
            }
        });

        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
        // --- 外部包裹的改变 ---
        clickgo.dom.watchSize(this.element, () => {
            const client = (this.props.direction === 'left' || this.props.direction === 'right') ? this.element.offsetWidth : this.element.offsetHeight;
            if (client === this.client) {
                return;
            }
            this.client = client;
            this.refresh();
        }, true);

        // --- 内部内容的改变 ---
        clickgo.dom.watchSize(this.refs.inner, () => {
            const length = (this.props.direction === 'left' || this.props.direction === 'right') ? this.refs.inner.offsetWidth : this.refs.inner.offsetHeight;
            if (length === this.length) {
                return;
            }
            this.length = length;
            this.refresh();
        }, true);
    }

}
