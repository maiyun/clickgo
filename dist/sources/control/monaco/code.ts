export let props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },

    'modelValue': {
        'default': ''
    },
    'language': {
        'default': undefined
    }
};

export let data = {
    'notInit': false,
    // 'monacoInstance': null
};

export let mounted = function(this: IVueControl): void {
    let monaco = clickgo.core.getModule('monaco');
    if (monaco) {
        this.monacoInstance = monaco.editor.create(this.$refs.monaco);
        clickgo.dom.watchSize(this.$refs.monaco, () => {
            this.monacoInstance.layout();
        });
    }
    else {
        // --- 没有成功 ---
        this.notInit = true;
    }
};

export let unmounted = function(this: IVueControl): void {
    if (this.monacoInstance) {
        this.monacoInstance.dispose();
    }
};
