import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.sleeping = false;
        this.purifyTxt = `<html>
    <head>
        <title>Hello world!</title>
    </head>
    <body>
        <!-- title -->
        <h1>Title</h1>
        <!-- content -->
        <div>content</div>
        <div>// abc</div>
        <script>
        // --- test ---
        if (a) {
           alert('zzz');
        }
        /* --- test 2 --- */
        if (b) {
           alert('zzz');
        }
        </script>
    </body>
</html>`;
        this.min = '10';
        this.max = '30';
        this.length = '8';
        this.block = '';
        this.url = 'HtTp://uSer:pAss@sUBDom.TopdOm23.CoM:29819/Admxw2Ksiz/dszas?Mdi=KdiMs1&a=JDd#hehHe';
        this.url1 = '/abc/def/hehe';
        this.url2 = '../bb.index';
        this.second = '4531';
        this.weight = '8761';
        this.qs = 'a=1&b=2&c=3';
    }
    async sleep() {
        if (this.sleeping) {
            return;
        }
        this.sleeping = true;
        await clickgo.tool.sleep(1000);
        this.sleeping = false;
    }
    purify() {
        this.purifyTxt = clickgo.tool.purify(this.purifyTxt);
    }
    rand() {
        clickgo.form.dialog(this, clickgo.tool.rand(parseInt(this.min), parseInt(this.max)).toString()).catch((e) => { throw e; });
    }
    async random() {
        await clickgo.form.dialog(this, {
            'direction': 'v',
            'content': '<text modelValue="' + clickgo.tool.random(parseInt(this.length), clickgo.tool.RANDOM_LUN, this.block) + '" readonly />',
            'data': {
                'txt': 'Text\nLine 2.'
            }
        });
    }
    escapeHTML() {
        clickgo.form.dialog(this, clickgo.tool.escapeHTML(this.purifyTxt)).catch((e) => { throw e; });
    }
    rgb2hsl() {
        clickgo.form.dialog(this, JSON.stringify(clickgo.tool.rgb2hsl('9,105,218'))).catch((e) => { throw e; });
    }
    parseUrl() {
        clickgo.form.dialog(this, JSON.stringify(clickgo.tool.parseUrl(this.url))).catch((e) => { throw e; });
    }
    urlResolve() {
        clickgo.form.dialog(this, clickgo.tool.urlResolve(this.url1, this.url2)).catch((e) => { throw e; });
    }
    async formatSecond() {
        await clickgo.form.dialog(this, clickgo.tool.formatSecond(parseInt(this.second) || 0));
    }
    async weightFormat() {
        await clickgo.form.dialog(this, clickgo.tool.weightFormat(parseInt(this.weight) || 0));
    }
    async queryParse() {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.tool.queryParse(this.qs)));
    }
    async queryStringify() {
        await clickgo.form.dialog(this, clickgo.tool.queryStringify({ 'a': 1, 'b': 'c' }));
    }
}
