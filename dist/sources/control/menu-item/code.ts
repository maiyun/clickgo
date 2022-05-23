import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'disabled': {
        'default': false
    },

    'alt': {
        'default': undefined
    }
};

export const computed = {
    'isDisabled': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};

export const methods = {
    enter: function(this: types.IVControl, e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const length = clickgo.dom.siblingsData(this.$el, 'cg-pop-open').length;
        if (length === 0) {
            // --- 别的没有展开，则不管 ---
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v', {
            'null': true
        });
    },
    click: function(this: types.IVControl): void {
        if (this.$el.dataset.cgPopOpen !== undefined) {
            // --- 本来是展开状态，就隐藏起来 ---
            clickgo.form.hidePop(this.$refs.pop);
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v', {
            'null': true
        });
    }
};
