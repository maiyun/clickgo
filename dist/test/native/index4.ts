import * as native from './native';
// --- 关闭窗口不会退出程序 ---
native.ready().then(function() {
    native.run('../desktop/index.html?single', {
        'quit': false
    });
}).catch(function(e) {
    console.log(e);
});
