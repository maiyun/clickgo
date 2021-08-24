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
    }
};

export let data = {
    'notInit': false
};

export let mounted = function(this: IVueControl): void {
    let monaco = clickgo.core.getModule('monaco');
    if (monaco) {
        const monacoInstance = monaco[0].editor.create(this.$refs.wrap, {
            'value': `<html>
    <head>
    <title>Monaco</title>
    </head>
    <body>
    Hello Monaco Editor!
    </body>
    </html>`,
            'language': 'html'
        });
        console.log('[2]', monacoInstance);
    }
    else {
        // --- 没有成功 ---
        this.notInit = true;
    }
};
