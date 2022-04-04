export const data = {
    'ntab': '',
    'tabs': [{
        'label': 'Tab1',
        'value': 'tab1'
    }],
    'tabPosition': 'top'
};

export const methods = {
    add: function(this: IVForm): void {
        this.tabs.push({ 'label': 'Tab' + ((this.tabs.length as number) + 1).toString(), 'value': 'tab' + ((this.tabs.length as number) + 1).toString() });
    },
    remove: function(this: IVForm): void {
        if (this.tabs.length > 0) {
            this.tabs.splice(this.tabs.length - 1);
        }
    },
    position: function(this: IVForm): void {
        switch (this.tabPosition) {
            case 'top':
                this.tabPosition = 'right';
                break;
            case 'right':
                this.tabPosition = 'bottom';
                break;
            case 'bottom':
                this.tabPosition = 'left';
                break;
            default:
                this.tabPosition = 'top';
        }
    }
};
