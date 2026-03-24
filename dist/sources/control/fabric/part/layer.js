/** --- 内部画板矩形的保留 name --- */
export const ARTBOARD_NAME = '__cg_artboard__';
/**
 * --- 获取 fabric 对象 name 属性（fabric v7 类型定义中 name 不在直接类型上，需转换访问）---
 * @param obj fabric 对象
 */
export function getName(obj) {
    return (obj.name) ?? '';
}
/**
 * --- 判断 fabric 对象是否为内部画板矩形 ---
 * @param obj fabric 对象
 */
export function isArtboard(obj) {
    return getName(obj) === ARTBOARD_NAME;
}
/**
 * --- 在图层列表（含子文件夹）中查找指定 name 的项及其所在父列表 ---
 * @param list 图层列表
 * @param name 图层 name
 */
export function findItem(list, name) {
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
export function buildStateMap(list, parentHidden = false, parentLocked = false) {
    const map = new Map();
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
export function layerMixin(base) {
    class Mixed extends base {
        layerList = [];
        layerUpdateStyle(isDragging) {
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
                'cornerStyle': 'rect',
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
        layerApplyMode() {
            if (!this.access.fabric || !this.access.canvas) {
                return;
            }
            const stateMap = buildStateMap(this.layerList);
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
                // --- autoLayer: 所有对象可交互；否则仅 layer 数组中的对象响应 ---
                const isActive = this.propBoolean('autoLayer') || this.props.layer.includes(objName);
                obj.set({ 'evented': isActive, 'selectable': isActive });
            });
            // --- 将 layer prop 对应的对象同步为 canvas 激活对象 ---
            if (this.props.layer.length > 0) {
                const allObjs = this.access.canvas.getObjects();
                const targetObjs = this.props.layer
                    .map(n => allObjs.find(o => getName(o) === n))
                    .filter((o) => !!o);
                if (targetObjs.length === 1) {
                    // --- 仅当当前激活对象不同时才切换，避免触发多余的 selection 事件 ---
                    if (this.access.canvas.getActiveObject() !== targetObjs[0]) {
                        this.access.canvas.setActiveObject(targetObjs[0]);
                    }
                }
                else if (targetObjs.length > 1) {
                    const cur = this.access.canvas.getActiveObject();
                    const curObjs = (cur instanceof this.access.fabric.ActiveSelection) ? cur.getObjects() : [];
                    // --- 仅当当前不是同等内容的 ActiveSelection 时才重建，避免触发多余的 selection 事件 ---
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
            // --- marquee 模式强制禁用 fabric 框选，防止上层 canvas 产生残留虚线框 ---
            this.access.canvas.selection = (this.props.mode !== 'marquee') && this.propBoolean('selector');
            this.layerUpdateStyle(false);
        }
        layerSetup() {
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
            const onSelectionChange = () => {
                this.layerUpdateStyle(false);
                if (!this.propBoolean('autoLayer')) {
                    return;
                }
                const activeObject = this.access.canvas?.getActiveObject();
                /** --- 获取当前激活图层的名称列表 --- */
                let names;
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
                if (names.length === prevNames.length && names.every(n => prevNames.includes(n))) {
                    return;
                }
                this.emit('update:layer', names);
                const event = {
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
        layerOnObjectAdded(obj) {
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
        layerOnSelectionCleared() {
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
            const event = {
                'detail': {
                    'prev': [...prevNames],
                    'next': [],
                }
            };
            this.emit('layerchange', event);
        }
        layerGetNames() {
            const result = [];
            const collect = (list) => {
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
        addLayer(name, title = name) {
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
        removeLayer(name) {
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
        renameLayer(name, title) {
            const found = findItem(this.layerList, name);
            if (!found) {
                return false;
            }
            found.item.title = title;
            this.emit('layerlistchange');
            return true;
        }
        setLayerVisible(name, visible) {
            const found = findItem(this.layerList, name);
            if (!found) {
                return false;
            }
            found.item.hidden = !visible;
            this.layerApplyMode();
            this.emit('layerlistchange');
            return true;
        }
        setLayerLocked(name, locked) {
            const found = findItem(this.layerList, name);
            if (!found) {
                return false;
            }
            found.item.locked = locked;
            this.layerApplyMode();
            this.emit('layerlistchange');
            return true;
        }
        addFolder(name, title = name) {
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
        moveLayer(names, refName, position) {
            const nameList = Array.isArray(names) ? names : [names];
            if (nameList.length === 0) {
                return false;
            }
            // --- refName 不能是被移动项之一 ---
            if (refName !== null && nameList.includes(refName)) {
                return false;
            }
            // --- 收集所有要移动的项 ---
            const founds = [];
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
            const parentGroups = new Map();
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
    return Mixed;
}
