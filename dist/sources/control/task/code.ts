import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'position': {
        'default': 'bottom'
    }
};

export const methods = {
    down: function(this: types.IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, (e) => {
                clickgo.form.showPop(this.$el, this.$refs.pop, e);
            });
        }
    },
    contextmenu: function(this: types.IVControl, e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, e);
    }
};
