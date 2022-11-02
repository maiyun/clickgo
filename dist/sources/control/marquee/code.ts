import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'direction': 'left',

        'scroll': true,
        'speed': 1
    };

    public padding = '';

    public left = 0;

    public top = 0;

    public client = 0;

    public length = 0;

    public dir = '';

    public timer = 0;

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    public get isScroll(): boolean {
        return clickgo.tool.getBoolean(this.props.scroll);
    }

    public get speedPx(): number {
        return this.props.speed * 0.5;
    }

    public refresh(): void {
        if (this.length === 0 || this.client === 0) {
            return;
        }
        if (this.isScroll) {
            // --- 无论是否超出都要滚动 ---
            if (this.timer > 0) {
                return;
            }
            this.dir = this.props.direction;
            switch (this.props.direction) {
                case 'left': {
                    this.left = this.client;
                    this.top = 0;
                    break;
                }
                case 'right': {
                    this.left = -this.length;
                    this.top = 0;
                    break;
                }
                case 'top': {
                    this.left = 0;
                    this.top = this.client;
                    break;
                }
                case 'bottom': {
                    this.left = 0;
                    this.top = -this.length;
                    break;
                }
            }
        }
        else if (this.length > this.client) {
            // --- 超出，来回滚 ---
            if (this.timer > 0) {
                return;
            }
            switch (this.props.direction) {
                case 'left':
                case 'right': {
                    this.dir = 'left';
                    break;
                }
                default: {
                    this.dir = 'top';
                }
            }
        }
        else {
            // --- 未超出、且不需要滚动 ---
            if (this.timer === 0) {
                return;
            }
            clickgo.task.offFrame(this.timer);
            this.timer = 0;
            this.left = 0;
            this.top = 0;
            return;
        }
        this.timer = clickgo.task.onFrame(async () => {
            if (!this.element.offsetParent) {
                clickgo.task.offFrame(this.timer);
                this.timer = 0;
                return;
            }
            if (this.isScroll) {
                switch (this.props.direction) {
                    case 'left': {
                        this.left -= this.speedPx;
                        if (this.left < -this.length) {
                            this.left = this.client;
                        }
                        break;
                    }
                    case 'right': {
                        this.left += this.speedPx;
                        if (this.left > this.client) {
                            this.left = -this.length;
                        }
                        break;
                    }
                    case 'top': {
                        this.top -=  this.speedPx;
                        if (this.top < -this.length) {
                            this.top = this.client;
                        }
                        break;
                    }
                    case 'bottom': {
                        this.top += this.speedPx;
                        if (this.top > this.client) {
                            this.top = -this.length;
                        }
                        break;
                    }
                }
            }
            else {
                /** --- 超出的部分 --- */
                const xv = this.length - this.client;
                switch (this.dir) {
                    case 'left': {
                        this.left -= this.speedPx;
                        if (this.left < -xv) {
                            this.dir = 'right';
                            this.left = -xv;
                            await clickgo.tool.sleep(1000);
                        }
                        break;
                    }
                    case 'right': {
                        this.left += this.speedPx;
                        if (this.left > 0) {
                            this.dir = 'left';
                            this.left = 0;
                            await clickgo.tool.sleep(1000);
                        }
                        break;
                    }
                    case 'top': {
                        this.top -= this.speedPx;
                        if (this.top < -xv) {
                            this.dir = 'bottom';
                            this.top = -xv;
                            await clickgo.tool.sleep(1000);
                        }
                        break;
                    }
                    case 'bottom': {
                        this.top += this.speedPx;
                        if (this.top > 0) {
                            this.dir = 'top';
                            this.top = 0;
                            await clickgo.tool.sleep(1000);
                        }
                        break;
                    }
                }
            }
        });
    }

    public onMounted(): void | Promise<void> {
        this.watch('scroll', (): void => {
            this.refresh();
        });
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
                if (!this.isScroll) {
                    this.dir = 'top';
                }
            }
            else {
                this.top = 0;
                if (!this.isScroll) {
                    this.dir = 'left';
                }
            }
        });

        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
        // --- 外部包裹的改变 ---
        clickgo.dom.watchSize(this.element, (size) => {
            const client = (this.props.direction === 'left' || this.props.direction === 'right') ? size.width : size.height;
            if (client !== this.client) {
                this.client = client;
            }
            this.refresh();
        }, true);
        // --- 内部内容的改变 ---
        clickgo.dom.watchSize(this.refs.inner, (size) => {
            const length = (this.props.direction === 'left' || this.props.direction === 'right') ? size.width : size.height;
            if (length !== this.length) {
                this.length = length;
            }
            this.refresh();
        }, true);
    }

}
