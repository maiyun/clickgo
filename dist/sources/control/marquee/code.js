import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    props = {
        'direction': 'left',
        'speed': 1
    };
    padding = '';
    left = 0;
    top = 0;
    client = 0;
    length = 0;
    timer = 0;
    ani = false;
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    get speedPx() {
        return this.propInt('speed') * 0.8;
    }
    refresh() {
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
            clickgo.task.offFrame(this, this.timer);
            this.timer = 0;
            this.left = 0;
            this.top = 0;
            return;
        }
        clickgo.task.sleep(this, () => {
            if (this.length <= this.client) {
                return;
            }
            if (this.timer > 0) {
                return;
            }
            // --- 没创建的 timer 的现在创建 timer ---
            this.timer = clickgo.task.onFrame(this, async () => {
                if (!clickgo.dom.inPage(this.element)) {
                    clickgo.task.offFrame(this, this.timer);
                    this.timer = 0;
                    return;
                }
                // --- 超出才滚动 ---
                const xv = this.length - this.client;
                switch (this.props.direction) {
                    case 'left': {
                        if (this.left === -xv) {
                            this.left = 0;
                            clickgo.task.sleep(this, () => {
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
                            clickgo.task.sleep(this, () => {
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
                            clickgo.task.sleep(this, () => {
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
                            clickgo.task.sleep(this, () => {
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
    onMounted() {
        this.watch('direction', (n, o) => {
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
        clickgo.dom.watchSize(this, this.element, () => {
            const client = (this.props.direction === 'left' || this.props.direction === 'right') ? this.element.offsetWidth : this.element.offsetHeight;
            if (client === this.client) {
                return;
            }
            this.client = client;
            this.refresh();
        }, true);
        // --- 内部内容的改变 ---
        clickgo.dom.watchSize(this, this.refs.inner, () => {
            const length = (this.props.direction === 'left' || this.props.direction === 'right') ? this.refs.inner.offsetWidth : this.refs.inner.offsetHeight;
            if (length === this.length) {
                return;
            }
            this.length = length;
            this.refresh();
        }, true);
    }
}
