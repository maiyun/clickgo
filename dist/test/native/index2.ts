import * as native from './native';
// --- 只运行单个程序 ---
native.ready().then(function() {
    native.run('../desktop/index.html?single');
}).catch(function(e) {
    console.log(e);
});
