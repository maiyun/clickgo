import * as types from '~/types/index';

export const data = {
    'title': 'Text viewer',
    'content': ''
};

export const receive = function(this: types.IVForm, obj: Record<string, any>): void {
    if (obj.taskId !== this.taskId) {
        return;
    }
    this.title = (obj.title as string) + ' - Text viewer';
    this.content = obj.content;
};
