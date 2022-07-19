import * as native from './native';
// --- 运行不带边框的桌面 ---
native.ready().then(function() {
    native.run('../desktop/index.html');
}).catch(function(e) {
    console.log(e);
});
