export let props = {
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

export let data = {
    'padding': '',
    'left': 0,
    'top': 0,
    'client': 0,
    'length': 0,

    'timer': undefined,
    'timerCount': 0
}

export let computed = {
    'opMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    },
    'isScroll': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.scroll);
    },
    'speedPx': function(this: IVControl): number {
        return this.speed * 0.5;
    }
};

export let watch = {
    'scroll': {
        handler: function(this: IVControl) {
            this.refresh();
        }
    },
    'direction': {
        handler: function(this: IVControl, n: string, o: string) {
            if (!this.timer) {
                return;
            }
            let ndir = (n === 'left' || n === 'right') ? 'h' : 'v';
            let odir = (o === 'left' || o === 'right') ? 'h' : 'v';
            if (ndir === odir) {
                return;
            }
            if (ndir === 'v') {
                this.left = 0;
                if (!this.isScroll) {
                    this.timer = 'top';
                }
            }
            else {
                this.top = 0;
                if (!this.isScroll) {
                    this.timer = 'left';
                }
            }
        }
    }
};

export let methods = {
    refresh: function(this: IVControl): void {
        if (this.length === 0 || this.client === 0) {
            return;
        }
        if (this.isScroll) {
            // --- 无论是否超出都要滚动 ---
            if (this.timer) {
                return;
            }
            this.timer = this.direction;
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
            if (this.timer) {
                return;
            }
            switch (this.direction) {
                case 'left':
                case "right": {
                    this.timer = 'left';
                    break;
                }
                default: {
                    this.timer = 'top';
                }
            }
        }
        else {
            // --- 未超出、且不滚动 ---
            if (!this.timer) {
                return;
            }
            this.timer = undefined;
            this.left = 0;
            this.top = 0;
            return;
        }
        this.animation(++this.timerCount);
    },
    animation: async function(this: IVControl, count: number): Promise<void> {
        if (!this.timer) {
            return;
        }
        if (!this.$el.offsetParent) {
            return;
        }
        if (count < this.timerCount) {
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
                    this.left +=  this.speedPx;
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
            let xv = this.length - this.client;
            switch (this.timer) {
                case 'left': {
                    this.left -= this.speedPx;
                    if (this.left < -xv) {
                        this.timer = 'right';
                        this.left = -xv;
                        await clickgo.tool.sleep(1000);
                    }
                    break;
                }
                case 'right': {
                    this.left += this.speedPx;
                    if (this.left > 0) {
                        this.timer = 'left';
                        this.left = 0;
                        await clickgo.tool.sleep(1000);
                    }
                    break;
                }
                case 'top': {
                    this.top -= this.speedPx;
                    if (this.top < -xv) {
                        this.timer = 'bottom';
                        this.top = -xv;
                        await clickgo.tool.sleep(1000);
                    }
                    break;
                }
                case 'bottom': {
                    this.top += this.speedPx;
                    if (this.top > 0) {
                        this.timer = 'top';
                        this.top = 0;
                        await clickgo.tool.sleep(1000);
                    }
                    break;
                }
            }
        }
        requestAnimationFrame(() => {
            this.animation(count);
        });
    } 
};

export let mounted = function(this: IVControl): void {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
    // --- 外部包裹的改变 ---
    clickgo.dom.watchSize(this.$el, (size) => {
        let client = (this.direction === 'left' || this.direction === 'right') ? size.width : size.height;
        if (client !== this.client) {
            this.client = client;
        }
        this.refresh();
    }, true);
    // --- 内部内容的改变 ---
    clickgo.dom.watchSize(this.$refs.inner, (size) => {
        let length = (this.direction === 'left' || this.direction === 'right') ? size.width : size.height;
        if (length !== this.length) {
            this.length = length;
        }
        this.refresh();
    }, true);
};