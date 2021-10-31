export let data = {
    'code': '',
    'language': 'HTML',
    'codeList': [
        `<html>
    <head>
        <title>Monaco</title>
    </head>
    <body>
        Hello Monaco Editor!
    </body>
</html>`,
        'export' + ` let props = {
}`,
        `.red {
    color: red;
}`
    ],
    'list': ['HTML', 'TypeScript', 'CSS'],
    'readonly': false
};

export let watch = {
    'language': {
        handler: function(this: IVueForm): void {
            this.code = this.codeList[this.list.indexOf(this.language)];
        },
        'immediate': true
    }
};

export let methods = {
};
