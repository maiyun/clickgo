export let data = {
    'timer': 0,
    'count': 0
};

export let methods = {
    start: function(this: IVForm, v: number): void {
        let opt = {};
        switch (v) {
            case 0: {
                opt = {
                    'count': 1
                };
                break;
            }
            case 1: {
                opt = {
                    'count': 100
                };
                break;
            }
            case 3: {
                opt = {
                    'scope': 'task'
                };
                break;
            }
        }
        this.timer = this.cgAddFrameListener(() => {
            ++this.count;
            console.log('this.count', this.count);
        }, opt);
    },
    end: function(this: IVForm): void {
        this.cgRemoveFrameListener(this.timer);
        this.count = 0;
        this.timer = 0;
    }
};