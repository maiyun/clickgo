export let data = {
    'nativeListeners': []
};

export let methods = {
    getNativeListeners: function(this: IVForm): void {
        let list = clickgo.core.getNativeListeners();
        this.nativeListeners = [];
        for (let item of list) {
            this.nativeListeners.push('name: ' + item.name + '[' + item.id + '], once: ' + (item.once ? 'true' : 'false'));
        }
    }
};
