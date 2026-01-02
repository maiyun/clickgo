import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    access = {
        'sseabort': null,
    };
    sleeping = false;
    purifyTxt = `<html>
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
    min = '10';
    max = '30';
    length = '8';
    block = '';
    url = 'HtTp://uSer:pAss@sUBDom.TopdOm23.CoM:29819/Admxw2Ksiz/dszas?Mdi=KdiMs1&a=JDd#hehHe';
    url1 = '/abc/def/hehe';
    url2 = '../bb.index';
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
    // --- SSE ---
    sseurl = 'http://127.0.0.1:8081/test/ai-stream1';
    sse = false;
    ssecontent = 'How are you';
    sseres = '';
    ssedo() {
        if (this.sse) {
            this.sse = false;
            this.access.sseabort?.abort();
            return;
        }
        this.sse = true;
        this.access.sseabort = clickgo.tool.postResponseEventStream(this.sseurl, {
            'content': this.ssecontent,
        }, {
            onData: (chunk) => {
                this.sseres += chunk;
            },
            onEnd: () => {
                this.sse = false;
            },
            onTimeout: () => {
                this.sse = false;
            },
        });
        this.ssecontent = '';
        this.sseres = '';
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
    second = '4531';
    async formatSecond() {
        await clickgo.form.dialog(this, clickgo.tool.formatSecond(parseInt(this.second) || 0));
    }
    weight = '8761';
    async weightFormat() {
        await clickgo.form.dialog(this, clickgo.tool.weightFormat(parseInt(this.weight) || 0));
    }
    qs = 'a=1&b=2&c=3';
    async queryParse() {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.tool.queryParse(this.qs)));
    }
    async queryStringify() {
        await clickgo.form.dialog(this, clickgo.tool.queryStringify({ 'a': 1, 'b': 'c' }));
    }
    compressor() {
        this.refs.file.select();
    }
    async change(files) {
        if (!files) {
            return;
        }
        const result = await clickgo.tool.compressor(files[0], {
            'quality': 0.5,
            'maxWidth': 2000,
        });
        if (!result) {
            return;
        }
        console.log('result', result, result instanceof File);
        await clickgo.form.dialog(this, 'name: ' + result.name + ', size: ' + clickgo.tool.sizeFormat(result.size) + ', osize: ' + clickgo.tool.sizeFormat(files[0].size));
    }
}
