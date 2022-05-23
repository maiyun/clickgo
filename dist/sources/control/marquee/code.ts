import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'direction': {
        'default': 'left'
    },

    'scroll': {
        'default': true
    },
    'speed': {
        'default': 1
    }
};

export const data = {
    'padding': '',
    'left': 0,
    'top': 0,
    'client': 0,
    'length': 0,

    'dir': '',
    'timer': 0
};

export const computed = {
    'opMargin': function(this: types.IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    },
    'isScroll': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.scroll);
    },
    'speedPx': function(this: types.IVControl): number {
        return this.speed * 0.5;
    }
};

export const watch = {
    'scroll': {
        handler: function(this: types.IVControl): void {
            this.refresh();
        }
    },
    'direction': {
        handler: function(this: types.IVControl, n: string, o: string): void {
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
        }
    }
};

export const methods = {
    refresh: function(this: types.IVControl): void {
        if (this.length === 0 || this.client === 0) {
            return;
        }
        if (this.isScroll) {
            // --- 无论是否超出都要滚动 ---
            if (this.timer > 0) {
                return;
            }
            this.dir = this.direction;
            switch (this.direction) {
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
            switch (this.direction) {
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
            if (!this.$el.offsetParent) {
                clickgo.task.offFrame(this.timer);
                this.timer = 0;
                return;
            }
            if (this.isScroll) {
                switch (this.direction) {
                    case 'left': {
                        this.left -= this.speedPx;
                        if (this.left < -this.length) {
                            this.left = this.client;
                        }
                        break;
                    }
                    case 'right': {
                        (this.left as number) += this.speedPx as number;
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
                        (this.top as number) += this.speedPx as number;
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
                        (this.left as number) += this.speedPx as number;
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
                        (this.top as number) += this.speedPx as number;
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
};

export const mounted = function(this: types.IVControl): void {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
    // --- 外部包裹的改变 ---
    clickgo.dom.watchSize(this.$el, (size) => {
        const client = (this.direction === 'left' || this.direction === 'right') ? size.width : size.height;
        if (client !== this.client) {
            this.client = client;
        }
        this.refresh();
    }, true);
    // --- 内部内容的改变 ---
    clickgo.dom.watchSize(this.$refs.inner, (size) => {
        const length = (this.direction === 'left' || this.direction === 'right') ? size.width : size.height;
        if (length !== this.length) {
            this.length = length;
        }
        this.refresh();
    }, true);
};
