import * as native from './native';
// --- 显示外边框 ---
native.ready().then(function() {
    native.run('../desktop/index.html', {
        'frame': true
    });
}).catch(function(e) {
    console.log(e);
});
