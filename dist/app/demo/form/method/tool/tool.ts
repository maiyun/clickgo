import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public sleeping = false;

    public purifyTxt = `<html>
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

    public min = '10';

    public max = '30';

    public length = '8';

    public block = '';

    public url = 'HtTp://uSer:pAss@sUBDom.TopdOm23.CoM:29819/Admxw2Ksiz/dszas?Mdi=KdiMs1&a=JDd#hehHe';

    public url1 = '/abc/def/hehe';

    public url2 = '../bb.index';

    public async sleep(): Promise<void> {
        if (this.sleeping) {
            return;
        }
        this.sleeping = true;
        await clickgo.tool.sleep(1000);
        this.sleeping = false;
    }

    public purify(): void {
        this.purifyTxt = clickgo.tool.purify(this.purifyTxt);
    }

    public rand(): void {
        clickgo.form.dialog(
            clickgo.tool.rand(parseInt(this.min), parseInt(this.max)).toString()
        ).catch((e) => { throw e; });
    }

    public random(): void {
        clickgo.form.dialog(
            clickgo.tool.random(parseInt(this.length), clickgo.tool.RANDOM_LN, this.block)
        ).catch((e) => { throw e; });
    }

    public escapeHTML(): void {
        clickgo.form.dialog(
            clickgo.tool.escapeHTML(this.purifyTxt)
        ).catch((e) => { throw e; });
    }

    public rgb2hsl(): void {
        clickgo.form.dialog(
            JSON.stringify(clickgo.tool.rgb2hsl('9,105,218'))
        ).catch((e) => { throw e; });
    }

    public parseUrl(): void {
        clickgo.form.dialog(
            JSON.stringify(clickgo.tool.parseUrl(this.url))
        ).catch((e) => { throw e; });
    }

    public urlResolve(): void {
        clickgo.form.dialog(
            clickgo.tool.urlResolve(this.url1, this.url2)
        ).catch((e) => { throw e; });
    }

    public second = '4531';

    public async formatSecond(): Promise<void> {
        await clickgo.form.dialog(clickgo.tool.formatSecond(parseInt(this.second) || 0));
    }

    public weight = '8761';

    public async weightFormat(): Promise<void> {
        await clickgo.form.dialog(clickgo.tool.weightFormat(parseInt(this.weight) || 0));
    }

    public qs = 'a=1&b=2&c=3';

    public async queryParse(): Promise<void> {
        await clickgo.form.dialog(JSON.stringify(clickgo.tool.queryParse(this.qs)));
    }

    public async queryStringify(): Promise<void>  {
        await clickgo.form.dialog(clickgo.tool.queryStringify({ 'a': 1, 'b': 'c' }));
    }

}
