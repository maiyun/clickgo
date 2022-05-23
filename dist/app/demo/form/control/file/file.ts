import * as types from '~/types/index';

export const data = {
    'accept': 'txt',
    'multi': 'false',
    'dir': 'false',
    'list': []
};

export const methods = {
    select: function(this: types.IVForm): void {
        this.$refs.file.select();
    },
    change: function(this: types.IVForm, files: FileList | null): void {
        this.list = [];
        if (!files) {
            return;
        }
        for (const file of files) {
            this.list.push((file.webkitRelativePath || file.name) + ' (' + file.size.toString() + ')');
        }
    }
};
