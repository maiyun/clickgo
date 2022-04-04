export const data = {
    'nativeListeners': []
};

export const methods = {
    getNativeListeners: function(this: IVForm): void {
        const list = clickgo.core.getNativeListeners();
        this.nativeListeners = [];
        for (const item of list) {
            this.nativeListeners.push(`name: ${item.name}[${item.id}], once: ${(item.once ? 'true' : 'false')}`);
        }
    }
};
