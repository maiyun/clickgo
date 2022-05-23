import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'disabled': {
        'default': false
    },

    'type': {
        'default': 'default'
    },
    'plain': {
        'default': false
    },
    'checked': {
        'default': undefined
    },
    'modelValue': {
        'default': undefined
    },

    'area': {
        'default': 'all'    // all, mark, arrow
    }
};

export const computed = {
    'isDisabled': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isPlain': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.plain);
    },
    'isChecked': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.checked);
    },
    'isAreaAllMark': function(this: types.IVControl): boolean {
        return this.$slots.pop ? (this.area === 'all' || this.area === 'mark') : true;
    },
    'isChildFocus': function(this: types.IVControl): boolean {
        return this.innerFocus || this.arrowFocus;
    },

    'opMargin': function(this: types.IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export const data = {
    'padding': '',

    'isKeyDown': false,

    'innerFocus': false,
    'arrowFocus': false
};

export const methods = {
    keydown: function(this: types.IVControl, e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.area === 'all' || this.area === 'mark') {
                this.innerClick(e);
                if (!this.$slots.pop) {
                    this.$el.click();
                }
            }
            else {
                if (this.innerFocus) {
                    this.innerClick(e);
                    this.$el.click();
                }
                else {
                    this.arrowClick(e);
                }
            }
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    },
    keyup: function(this: types.IVControl, e: KeyboardEvent): void {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        if (this.area === 'all' || this.area === 'mark') {
            this.innerClick(e);
            if (!this.$slots.pop) {
                this.$el.click();
            }
        }
        else {
            if (this.innerFocus) {
                this.innerClick(e);
                this.$el.click();
            }
            else {
                this.arrowClick(e);
            }
        }
    },
    down: function(this: types.IVControl, e: MouseEvent | TouchEvent): void {
        if (this.area !== 'mark') {
            return;
        }
        clickgo.dom.bindLong(e, () => {
            clickgo.form.showPop(this.$refs.arrow, this.$refs.pop, 'h');
        });
    },

    innerClick: function(this: types.IVControl, e: MouseEvent): void {
        if (!this.$slots.pop || (this.area === 'arrow' || this.area === 'mark')) {
            // --- 没有菜单，或者有菜单，但是只有点击 arrow 区域才会显示、隐藏 ---
            return;
        }
        // --- 全局模式，要显示/隐藏菜单 ---
        e.stopPropagation();
        // --- 检测是否显示 pop ---
        if (this.$el.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
        }
        else {
            clickgo.form.hidePop(this.$el);
        }
    },

    arrowClick: function(this: types.IVControl, e: MouseEvent): void {
        e.stopPropagation();
        if (this.area === 'all') {
            if (this.$el.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
            }
            else {
                clickgo.form.hidePop(this.$el);
            }
        }
        else {
            if (this.$refs.arrow.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.$refs.arrow, this.$refs.pop, this.area === 'arrow' ? 'v' : 'h');
            }
            else {
                clickgo.form.hidePop(this.$refs.arrow);
            }
        }
    }
};

export const mounted = function(this: types.IVControl): void {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
};
