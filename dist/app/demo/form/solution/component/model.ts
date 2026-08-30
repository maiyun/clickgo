export type TToolId = 'brush' | 'pencil';

export interface IToolOptions {
    'color': string;
    'opacity': string;
    'size': string;
}

export interface IHistoryState {
    'redo': number;
    'stroke': number;
    'undo': number;
}
