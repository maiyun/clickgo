import * as clickgo from 'clickgo';
import * as fabric from 'fabric';

import * as pCore from './core';

/** --- 内部画板矩形的保留 name --- */
export const ARTBOARD_NAME = '__cg_artboard__';

/**
 * --- 获取 fabric 对象 name 属性（fabric v7 类型定义中 name 不在直接类型上，需转换访问）---
 * @param obj fabric 对象
 */
export function getName(obj: fabric.FabricObject): string {
    return ((obj as unknown as { 'name'?: string; }).name) ?? '';
}

/**
 * --- 判断 fabric 对象是否为内部画板矩形 ---
 * @param obj fabric 对象
 */
export function isArtboard(obj: fabric.FabricObject): boolean {
    return getName(obj) === ARTBOARD_NAME;
}

/**
 * --- 在图层列表（含子文件夹）中查找指定 name 的项及其所在父列表 ---
 * @param list 图层列表
 * @param name 图层 name
 */
export function findItem(
    list: ILayerMixin['layerList'],
    name: string
): { 'item': ILayerMixin['layerList'][0]; 'parent': ILayerMixin['layerList']; } | null {
    for (const item of list) {
        if (item.name === name) {
            return { 'item': item, 'parent': list };
        }
        if (item.type === 'folder' && item.children) {
            const found = findItem(item.children, name);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

/**
 * --- 递归构建图层有效状态映射，子项继承父文件夹的 hidden/locked 状态 ---
 * @param list 图层列表
 * @param parentHidden 父文件夹是否隐藏
 * @param parentLocked 父文件夹是否锁定
 */
export function buildStateMap(
    list: ILayerMixin['layerList'],
    parentHidden: boolean = false,
    parentLocked: boolean = false
): Map<string, { 'hidden': boolean; 'locked': boolean; }> {
    const map = new Map<string, { 'hidden': boolean; 'locked': boolean; }>();
    for (const item of list) {
        const hidden = parentHidden || item.hidden;
        const locked = parentLocked || item.locked;
        if (item.type === 'folder') {
            if (item.children) {
                const childMap = buildStateMap(item.children, hidden, locked);
                for (const [k, v] of childMap) {
                    map.set(k, v);
                }
            }
        }
        else {
            map.set(item.name, { 'hidden': hidden, 'locked': locked });
        }
    }
    return map;
}

// --- 控件类 ---

type TConstructor<T = clickgo.control.AbstractControl &
    pCore.ICore
> = abstract new (...args: any[]) => T;

export function layerMixin<
    TBase extends TConstructor<clickgo.control.AbstractControl>
>(base: TBase): TBase & TConstructor<ILayerMixin> {

    abstract class Mixed extends (base as unknown as TConstructor) implements ILayerMixin {

        public layerList: ILayerMixin['layerList'] = [];

        /** --- layerApplyMode 正在以编程方式修改 canvas 选区，此期间压制 onSelectionChange 的反向 emit --- */
        private _layerApplying: boolean = false;

        public layerUpdateStyle(isDragging: boolean): void {
            if (!this.access.fabric || !this.access.canvas) {
                return;
            }
            const showControls = this.propBoolean('transform') && !isDragging;
            const style = getComputedStyle(this.element);
            const borderColor = style.getPropertyValue('--cg').trim();
            const props = {
                'cornerColor': style.getPropertyValue('--g-plain-background').trim(),
                'cornerStrokeColor': borderColor,
                'cornerSize': 8,
                'cornerStyle': 'rect' as const,
                'transparentCorners': false,
                'borderColor': borderColor,
                /** --- 拖动时线条变粗（2px），常态为 1px --- */
                'borderScaleFactor': isDragging ? 2 : 1,
                'borderOpacityWhenMoving': 1,
                'hasBorders': showControls,
                'hasControls': showControls,
                'hoverCursor': showControls ? 'move' : 'default',
                'moveCursor': showControls ? 'move' : 'default',
            };
            this.access.canvas.forEachObject(obj => {
                if (isArtboard(obj)) {
                    return;
                }
                obj.set(props);
            });
            // --- ActiveSelection 为虚拟对象不计入 forEachObject，需单独应用样式 ---
            const activeObject = this.access.canvas.getActiveObject();
            if (activeObject instanceof this.access.fabric.ActiveSelection) {
                activeObject.set(props);
            }
            this.access.canvas.requestRenderAll();
        }

        public layerApplyMode(): void {
            if (!this.access.fabric || !this.access.canvas) {
                return;
            }
            const stateMap = buildStateMap(this.layerList);
            // --- 将 layer prop 中的文件夹 name 展开为其内部所有叶子图层 name 的集合 ---
            const effectiveSelected = new Set<string>();
            const collectSelected = (list: ILayerMixin['layerList'], parentSelected: boolean): void => {
                for (const item of list) {
                    const selected = parentSelected || this.props.layer.includes(item.name);
                    if (item.type === 'folder') {
                        if (item.children) {
                            collectSelected(item.children, selected);
                        }
                    }
                    else if (selected) {
                        effectiveSelected.add(item.name);
                    }
                }
            };
            collectSelected(this.layerList, false);
            this.access.canvas.forEachObject(obj => {
                if (isArtboard(obj)) {
                    return;
                }
                const objName = getName(obj);
                const state = stateMap.get(objName);
                // --- 隐藏图层：不可见且不可交互 ---
                if (state?.hidden) {
                    obj.set({ 'visible': false, 'evented': false, 'selectable': false });
                    return;
                }
                obj.set({ 'visible': true });
                // --- pan / zoom / marquee 模式下所有对象均不可交互 ---
                if (this.props.mode === 'pan' || this.props.mode === 'zoom' || this.props.mode === 'marquee') {
                    obj.set({ 'evented': false, 'selectable': false });
                    return;
                }
                // --- 锁定图层：可见但不可交互 ---
                if (state?.locked) {
                    obj.set({ 'evented': false, 'selectable': false });
                    return;
                }
                // --- autoLayer: 所有对象可交互；否则仅 layer 中指定（含文件夹展开）的对象响应 ---
                const isActive = this.propBoolean('autoLayer') || effectiveSelected.has(objName);
                obj.set({ 'evented': isActive, 'selectable': isActive });
            });
            // --- 将 layer prop 对应的对象同步为 canvas 激活对象（含文件夹展开后的子图层）---
            // --- 此期间设置标志，防止 selection:created/updated 反向覆写 layer prop ---
            this._layerApplying = true;
            if (this.props.layer.length > 0) {
                const allObjs = this.access.canvas.getObjects();
                // --- 排除锁定/隐藏对象：它们不应被包入 ActiveSelection，否则可随组拖动 ---
                const targetObjs = allObjs.filter(o => {
                    if (isArtboard(o)) {
                        return false;
                    }
                    const name = getName(o);
                    if (!effectiveSelected.has(name)) {
                        return false;
                    }
                    const state = stateMap.get(name);
                    return !state?.hidden && !state?.locked;
                });
                if (targetObjs.length === 1) {
                    if (this.access.canvas.getActiveObject() !== targetObjs[0]) {
                        this.access.canvas.setActiveObject(targetObjs[0]);
                    }
                }
                else if (targetObjs.length > 1) {
                    const cur = this.access.canvas.getActiveObject();
                    const curObjs = (cur instanceof this.access.fabric.ActiveSelection) ? cur.getObjects() : [];
                    if (curObjs.length !== targetObjs.length || !targetObjs.every(o => curObjs.includes(o))) {
                        const sel = new this.access.fabric.ActiveSelection(targetObjs, { 'canvas': this.access.canvas });
                        this.access.canvas.setActiveObject(sel);
                    }
                }
                else {
                    this.access.canvas.discardActiveObject();
                }
            }
            else if (!this.propBoolean('autoLayer')) {
                this.access.canvas.discardActiveObject();
            }
            this._layerApplying = false;
            // --- marquee 模式强制禁用 fabric 框选，防止上层 canvas 产生残留虚线框 ---
            this.access.canvas.selection = (this.props.mode !== 'marquee') && this.propBoolean('selector');
            this.layerUpdateStyle(false);
        }

        public layerSetup(): void {
            if (!this.access.canvas) {
                return;
            }
            // --- 监听 prop 变更 ---
            this.watch('autoLayer', () => {
                this.layerApplyMode();
            });
            this.watch('transform', () => {
                this.layerUpdateStyle(false);
            });
            this.watch('layer', () => {
                this.layerApplyMode();
            });
            this.watch('selector', () => {
                if (!this.access.canvas) {
                    return;
                }
                this.access.canvas.selection = this.propBoolean('selector');
            });
            this.watch('mode', () => {
                this.layerApplyMode();
            });
            // --- canvas 事件绑定 ---
            this.access.canvas.on('before:selection:cleared', () => {
                this.layerUpdateStyle(false);
            });
            /**
             * --- 选区创建/更新时：刷新控制点样式并触发图层变更事件 ---
             */
            const onSelectionChange = (): void => {
                this.layerUpdateStyle(false);
                // --- autoLayer 关闭，或正处于 layerApplyMode 编程选区阶段，均不反向更新 layer prop ---
                if (!this.propBoolean('autoLayer') || this._layerApplying) {
                    return;
                }
                const activeObject = this.access.canvas?.getActiveObject();
                /** --- 获取当前激活图层的名称列表 --- */
                let names: string[];
                if (this.access.fabric && activeObject instanceof this.access.fabric.ActiveSelection) {
                    names = activeObject.getObjects().map(o => getName(o));
                }
                else if (activeObject) {
                    names = [getName(activeObject)];
                }
                else {
                    names = [];
                }
                const prevNames = this.props.layer;
                // --- 若新选中的对象均在当前 layer 作用域内（含文件夹展开），保持 layer 不变 ---
                // --- 例如 layer=['shapes'] 时点击其内部的 rect，不应把 layer 覆写为 ['rect'] ---
                const scope = new Set<string>();
                const collectScope = (list: ILayerMixin['layerList'], parentSelected: boolean): void => {
                    for (const item of list) {
                        const selected = parentSelected || prevNames.includes(item.name);
                        if (item.type === 'folder') {
                            if (item.children) {
                                collectScope(item.children, selected);
                            }
                        }
                        else if (selected) {
                            scope.add(item.name);
                        }
                    }
                };
                collectScope(this.layerList, false);
                if (scope.size > 0 && names.length > 0 && names.every(n => scope.has(n))) {
                    return;
                }
                if (names.length === prevNames.length && names.every(n => prevNames.includes(n))) {
                    return;
                }
                this.emit('update:layer', names);
                const event: clickgo.control.IFabricLayerchangeEvent = {
                    'detail': {
                        'prev': [...prevNames],
                        'next': names,
                    }
                };
                this.emit('layerchange', event);
            };
            this.access.canvas.on('selection:created', onSelectionChange);
            this.access.canvas.on('selection:updated', onSelectionChange);
            this.access.canvas.on('object:moving', () => {
                this.layerUpdateStyle(true);
            });
            this.access.canvas.on('object:scaling', () => {
                this.layerUpdateStyle(true);
            });
            this.access.canvas.on('object:rotating', () => {
                this.layerUpdateStyle(true);
            });
            this.access.canvas.on('object:modified', () => {
                this.layerUpdateStyle(false);
            });
        }

        public layerOnObjectAdded(obj: fabric.FabricObject): void {
            const objName = getName(obj);
            if (!objName) {
                return;
            }
            // --- 若已在 layerList 中则不重复注册 ---
            if (findItem(this.layerList, objName)) {
                return;
            }
            this.layerList.push({
                'type': 'layer',
                'name': objName,
                'title': objName,
                'locked': false,
                'hidden': false,
            });
            this.emit('layerlistchange');
        }

        public layerOnSelectionCleared(): void {
            if (!this.propBoolean('autoLayer')) {
                // --- 手动图层模式：点击空白不应丢失激活状态，重建与 layer prop 一致 ---
                if (this.props.layer.length > 0 && this.access.canvas) {
                    this.layerApplyMode();
                }
                return;
            }
            const prevNames = this.props.layer;
            if (prevNames.length === 0) {
                return;
            }
            this.emit('update:layer', []);
            const event: clickgo.control.IFabricLayerchangeEvent = {
                'detail': {
                    'prev': [...prevNames],
                    'next': [],
                }
            };
            this.emit('layerchange', event);
        }

        public layerGetNames(): string[] {
            const result: string[] = [];
            const collect = (list: ILayerMixin['layerList']): void => {
                for (const item of list) {
                    if (item.type === 'folder') {
                        if (item.children) {
                            collect(item.children);
                        }
                    }
                    else {
                        result.push(item.name);
                    }
                }
            };
            collect(this.layerList);
            return result;
        }

        public addLayer(name: string, title: string = name): boolean {
            if (findItem(this.layerList, name)) {
                return false;
            }
            this.layerList.push({
                'type': 'layer',
                'name': name,
                'title': title,
                'locked': false,
                'hidden': false,
            });
            this.emit('layerlistchange');
            return true;
        }

        public removeLayer(name: string): void {
            const found = findItem(this.layerList, name);
            if (!found) {
                return;
            }
            const idx = found.parent.indexOf(found.item);
            found.parent.splice(idx, 1);
            // --- 删除该图层下的所有 fabric 对象 ---
            if (this.access.canvas) {
                const toRemove = this.access.canvas.getObjects().filter(obj => getName(obj) === name);
                for (const obj of toRemove) {
                    this.access.canvas.remove(obj);
                }
            }
            // --- 若当前激活图层包含此 name，从 layer prop 中移除（watcher 会自动调用 applyMode）---
            if (this.props.layer.includes(name)) {
                this.emit('update:layer', this.props.layer.filter(n => n !== name));
            }
            this.emit('layerlistchange');
        }

        public renameLayer(name: string, title: string): boolean {
            const found = findItem(this.layerList, name);
            if (!found) {
                return false;
            }
            found.item.title = title;
            this.emit('layerlistchange');
            return true;
        }

        public setLayerVisible(name: string, visible: boolean): boolean {
            const found = findItem(this.layerList, name);
            if (!found) {
                return false;
            }
            found.item.hidden = !visible;
            this.layerApplyMode();
            this.emit('layerlistchange');
            return true;
        }

        public setLayerLocked(name: string, locked: boolean): boolean {
            const found = findItem(this.layerList, name);
            if (!found) {
                return false;
            }
            found.item.locked = locked;
            this.layerApplyMode();
            this.emit('layerlistchange');
            return true;
        }

        public addFolder(name: string, title: string = name): boolean {
            if (findItem(this.layerList, name)) {
                return false;
            }
            this.layerList.push({
                'type': 'folder',
                'name': name,
                'title': title,
                'locked': false,
                'hidden': false,
                'children': [],
            });
            this.emit('layerlistchange');
            return true;
        }

        public moveLayer(names: string | string[], refName: string | null, position: 'before' | 'after' | 'inside'): boolean {
            const nameList = Array.isArray(names) ? names : [names];
            if (nameList.length === 0) {
                return false;
            }
            // --- refName 不能是被移动项之一 ---
            if (refName !== null && nameList.includes(refName)) {
                return false;
            }
            // --- 收集所有要移动的项 ---
            const founds: Array<{ 'item': ILayerMixin['layerList'][0]; 'parent': ILayerMixin['layerList']; }> = [];
            for (const name of nameList) {
                const found = findItem(this.layerList, name);
                if (!found) {
                    return false;
                }
                founds.push(found);
            }
            // --- 移入文件夹时：目标文件夹不能是被移动项的子孙 ---
            if (refName !== null && position === 'inside') {
                for (const { item } of founds) {
                    if (item.type === 'folder' && item.children && findItem(item.children, refName)) {
                        return false;
                    }
                }
            }
            // --- 按父列表分组，组内按索引降序删除，避免删除时索引偏移 ---
            const parentGroups = new Map<ILayerMixin['layerList'], Array<{ 'item': ILayerMixin['layerList'][0]; 'idx': number; }>>();
            for (const { item, parent } of founds) {
                let group = parentGroups.get(parent);
                if (!group) {
                    group = [];
                    parentGroups.set(parent, group);
                }
                group.push({ item, 'idx': parent.indexOf(item) });
            }
            for (const [parent, group] of parentGroups) {
                group.sort((a, b) => b.idx - a.idx);
                for (const { idx } of group) {
                    parent.splice(idx, 1);
                }
            }
            const movedItems = founds.map(f => f.item);
            if (refName === null) {
                // --- 移动到根列表末尾 ---
                this.layerList.push(...movedItems);
            }
            else {
                const ref = findItem(this.layerList, refName);
                if (!ref) {
                    // --- 目标不存在（理论上不应发生），回退到根列表末尾 ---
                    this.layerList.push(...movedItems);
                    this.emit('layerlistchange');
                    return false;
                }
                if (position === 'inside') {
                    if (ref.item.type !== 'folder') {
                        this.layerList.push(...movedItems);
                        this.emit('layerlistchange');
                        return false;
                    }
                    ref.item.children ??= [];
                    ref.item.children.push(...movedItems);
                }
                else {
                    const dstList = ref.parent;
                    const refIdx = dstList.indexOf(ref.item);
                    const insertIdx = (position === 'before') ? refIdx : refIdx + 1;
                    dstList.splice(insertIdx, 0, ...movedItems);
                }
            }
            this.emit('layerlistchange');
            return true;
        }

    }

    return Mixed as unknown as TBase & TConstructor<ILayerMixin>;
}

export interface ILayerMixin {

    'layerList': Array<{
        'type': 'layer' | 'folder';
        /** --- 图层唯一标识，对应 fabric 对象的 name 属性 --- */
        'name': string;
        /** --- 图层显示名称 --- */
        'title': string;
        /** --- 图层是否锁定，锁定后不可编辑 --- */
        'locked': boolean;
        /** --- 图层是否隐藏，隐藏后不可见且不可编辑 --- */
        'hidden': boolean;
        /** --- 子图层列表，仅在 type 为 folder 时存在 --- */
        'children'?: ILayerMixin['layerList'];
    }>;

    /**
     * --- 更新所有对象的控制点和边框样式 ---
     * @param isDragging 是否处于拖动/变换操作中
     */
    layerUpdateStyle(isDragging: boolean): void;

    /**
     * --- 根据 mode / layer / selector prop 及 layerList 的 locked/hidden 同步画布内所有对象的交互状态 ---
     */
    layerApplyMode(): void;

    /**
     * --- 初始化图层相关的 prop 监听和 canvas 事件绑定，在 onMounted 中画布初始化完成后调用 ---
     */
    layerSetup(): void;

    /**
     * --- 当 fabric 对象加入画布时调用，自动将有 name 的对象注册到 layerList ---
     * @param obj 新加入的 fabric 对象
     */
    layerOnObjectAdded(obj: fabric.FabricObject): void;

    /**
     * --- 当画布 selection:cleared 时调用，处理图层变更事件（不含交互恢复逻辑） ---
     */
    layerOnSelectionCleared(): void;

    /**
     * --- 获取 layerList 中所有图层（非文件夹）的 name 扁平列表 ---
     */
    layerGetNames(): string[];

    /**
     * --- 供用户调用，新建一个空图层 ---
     * @param name 图层 name，不能与已有图层/文件夹重复
     * @param title 图层显示名称，默认与 name 相同
     */
    addLayer(name: string, title?: string): boolean;

    /**
     * --- 供用户调用，移除图层及其所有 fabric 对象 ---
     * @param name 图层 name
     */
    removeLayer(name: string): void;

    /**
     * --- 供用户调用，重命名图层或文件夹的显示名称 ---
     * @param name 图层 name
     * @param title 新显示名称
     */
    renameLayer(name: string, title: string): boolean;

    /**
     * --- 供用户调用，设置图层/文件夹的可见性 ---
     * @param name 图层 name
     * @param visible 是否可见
     */
    setLayerVisible(name: string, visible: boolean): boolean;

    /**
     * --- 供用户调用，设置图层/文件夹的锁定状态 ---
     * @param name 图层 name
     * @param locked 是否锁定
     */
    setLayerLocked(name: string, locked: boolean): boolean;

    /**
     * --- 供用户调用，新建一个文件夹图层 ---
     * @param name 文件夹 name，不能与已有图层/文件夹重复
     * @param title 文件夹显示名称，默认与 name 相同
     */
    addFolder(name: string, title?: string): boolean;

    /**
     * --- 供用户调用，跨级移动图层/文件夹到指定位置（支持批量） ---
     * @param names 要移动的图层/文件夹 name，单个字符串或数组，多选时保持传入顺序
     * @param refName 参考目标的 name；null 表示移动到根列表末尾
     * @param position before 插入 refName 之前，after 插入 refName 之后，inside 插入到 refName 文件夹内末尾
     */
    moveLayer(names: string | string[], refName: string | null, position: 'before' | 'after' | 'inside'): boolean;

}
