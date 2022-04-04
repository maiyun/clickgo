import * as native from './native';

native.ready().then(function() {
    native.run('../desktop/index.html');
}).catch(function(e) {
    console.log(e);
});
