export declare let data: {
    width: number;
    height: number;
    theme: string;
};
export declare let methods: {
    openOnlyClose: (this: IVue) => void;
    openThin: (this: IVue) => void;
    openBorderNone: (this: IVue) => void;
    openAero: (this: IVue) => void;
    openMax: (this: IVue) => void;
    openMove: (this: IVue) => void;
    openScroll: (this: IVue) => void;
    openView: (this: IVue) => void;
    openGreatView: (this: IVue) => void;
    openOverflow: (this: IVue) => void;
    runTaskmgr: (this: IVue) => Promise<void>;
    changeTheme: (this: IVue) => Promise<void>;
    openError: (this: IVue) => void;
};
