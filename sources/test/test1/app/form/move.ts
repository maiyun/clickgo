export let data = {
    'b1p': {
        'left': 0,
        'top': 0
    },
    'b2p': {
        'left': 0,
        'top': 0
    },
    'b2po': {
        'left': 0,
        'top': 0
    }
};

export let methods = {
    b1Down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        clickgo.element.bindMove(e, {
            'object': this.$refs.b1,
            'offsetObject': this.$refs.o1,
            'move': (ox, oy): void => {
                this.b1p.left += ox;
                this.b1p.top += oy;
            }
        });
    },
    b2Down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        let r = this.$refs.b2.$el.getBoundingClientRect();
        let rectWidth = 0, rectHeight = 0;
        let rect = clickgo.element.bindMove(e, {
            'object': this.$refs.b2,
            'offsetObject': this.$refs.o2,
            'move': (ox, oy): void => {
                this.b2po.left += ox;
                this.b2po.top += oy;
                this.b2p.left = this.b2po.left / rectWidth * 100;
                this.b2p.top = this.b2po.top / rectHeight * 100;
            }
        });
        rectWidth = rect.right - rect.left;
        rectHeight = rect.bottom - rect.top;
        this.b2po.left = r.left - rect.left;
        this.b2po.top = r.top - rect.top;
    },
};
