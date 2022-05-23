import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'selected': {
        'default': false
    },
    'opened': {
        'default': false
    },
    'multi': {
        'default': false
    }
};

export const computed = {
    'isSelected': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.selected);
    },
    'isOpened': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.opened);
    },
    'isMulti': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.multi);
    },
    'position': function(this: types.IVControl): string {
        return this.cgParentByName('task')?.position ?? 'bottom';
    }
};

export const methods = {
    click: function(this: types.IVControl): void {
        if (!this.$slots.pop) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
    },
    contextmenu: function(this: types.IVControl, e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.$slots.contextmenu) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.contextmenu, 'v');
    },
    down: function(this: types.IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            // --- 是否要隐藏 ---
            if (e instanceof MouseEvent && e.button === 2) {
                // --- 点击鼠标右键 ---
                if (this.$el.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
            else {
                if (this.$refs.contextmenu?.dataset.cgOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                if (this.$refs.pop?.dataset.cgOpen !== undefined) {
                    clickgo.form.hidePop();
                }
                clickgo.form.showPop(this.$el, this.$refs.contextmenu, 'v');
            });
        }
    }
};
