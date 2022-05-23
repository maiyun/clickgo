import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
    'sleeping': false,
    'purifyTxt': `<html>
    <head>
        <title>Hello world!</title>
    </head>
    <body>
        <!-- title -->
        <h1>Title</h1>
        <!-- content -->
        <div>content</div>
    </body>
</html>`,
    'min': '10',
    'max': '30',
    'length': '8',
    'block': '',
    'url': 'HtTp://uSer:pAss@sUBDom.TopdOm23.CoM:29819/Admxw2Ksiz/dszas?Mdi=KdiMs1&a=JDd#hehHe',
    'url1': '/abc/def/hehe',
    'url2': '../bb.index'
};

export const methods = {
    sleep: async function(this: types.IVForm): Promise<void> {
        if (this.sleeping) {
            return;
        }
        this.sleeping = true;
        await clickgo.tool.sleep(1000);
        this.sleeping = false;
    },
    purify: function(this: types.IVForm): void {
        this.purifyTxt = clickgo.tool.purify(this.purifyTxt);
    },
    rand: function(this: types.IVForm): void {
        clickgo.form.dialog(
            clickgo.tool.rand(parseInt(this.min), parseInt(this.max)).toString()
        ).catch((e) => { throw e; });
    },
    random: function(this: types.IVForm): void {
        clickgo.form.dialog(
            clickgo.tool.random(parseInt(this.length), clickgo.tool.RANDOM_LN, this.block)
        ).catch((e) => { throw e; });
    },
    escapeHTML: function(this: types.IVForm): void {
        clickgo.form.dialog(
            clickgo.tool.escapeHTML(this.purifyTxt)
        ).catch((e) => { throw e; });
    },
    parseUrl: function(this: types.IVForm): void {
        clickgo.form.dialog(
            JSON.stringify(clickgo.tool.parseUrl(this.url))
        ).catch((e) => { throw e; });
    },
    urlResolve: function(this: types.IVForm): void {
        clickgo.form.dialog(
            clickgo.tool.urlResolve(this.url1, this.url2)
        ).catch((e) => { throw e; });
    }
};
