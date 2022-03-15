export let data = {
    'lineCount': 2,
    'style': false,

    'direction': 'top',
    'scroll': false
};

export let methods = {
    changeDirection: function(this: IVForm): void {
        switch (this.direction) {
            case 'top': {
                this.direction = 'bottom';
                break;
            }
            case 'bottom': {
                this.direction = 'left';
                break;
            }
            case 'left': {
                this.direction = 'right';
                break;
            }
            default: {
                this.direction = 'top';
            }
        }
    }
};
