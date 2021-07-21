export let data = {
    'width': 0,
    'height': 0,
    'scale': 4,
    'list': []
};

export let mounted = function(this: IVueForm): void {
    this.cgSetSystemEventListener('screenResize', (): void => {
        let area = clickgo.form.getAvailArea();
        this.width = area.width;
        this.height = area.height;
        if (this.width > 1100 || this.height > 1100) {
            this.scale = 5;
        }
        else if (this.width < 420 || this.height < 420) {
            this.scale = 3;
        }
        else {
            this.scale = 4;
        }
        let date = new Date();
        this.list.unshift({
            'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            'width': area.width,
            'height': area.height
        });
    });
    let area = clickgo.form.getAvailArea();
    this.width = area.width;
    this.height = area.height;
    if (this.width > 1100 || this.height > 1100) {
        this.scale = 5;
    }
    else if (this.width < 420 || this.height < 420) {
        this.scale = 3;
    }
    else {
        this.scale = 4;
    }
    let date = new Date();
    this.list.unshift({
        'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        'width': this.width,
        'height': this.height
    });
};
