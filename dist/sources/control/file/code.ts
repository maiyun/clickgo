import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'accept': {
        'default': undefined
    },
    'multi': {
        'default': false
    },
    'dir': {
        'default': false
    }
};

export const computed = {
    'isMulti': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.multi);
    },
    'isDir': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.dir);
    },

    'acceptComp': function(this: types.IVControl): string | undefined {
        if (!this.accept) {
            return undefined;
        }
        if (!Array.isArray(this.accept)) {
            return undefined;
        }
        const accept: string[] = [];
        for (const item of this.accept) {
            if (typeof item !== 'string') {
                continue;
            }
            accept.push('.' + item);
        }
        return accept.join(',');
    }
};

export const methods = {
    select: function(this: types.IVControl): void {
        this.$refs.input.click();
    },
    change: function(this: types.IVControl, e: InputEvent): void {
        e.stopPropagation();
        const inputEl = this.$refs.input as unknown as HTMLInputElement;
        this.$emit('change', inputEl.files);
        inputEl.value = '';
    }
};
