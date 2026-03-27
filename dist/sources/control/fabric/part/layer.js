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
function findItem(list, name) {
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
 * @param map 累加结果（递归传入）
 */
function buildStateMap(list, parentHidden = false, parentLocked = false, map = new Map()) {
    for (const item of list) {
        const hidden = parentHidden || item.hidden;
        const locked = parentLocked || item.locked;
        if (item.type === 'folder' && item.children) {
            buildStateMap(item.children, hidden, locked, map);
        }
        else {
            map.set(item.name, { 'hidden': hidden, 'locked': locked });
        }
    }
    return map;
}
/**
 * --- 给定叶子图层 name，在图层列表中查找其所属的最顶层文件夹 name ---
 * @param list 图层列表
 * @param name 叶子图层 name
 * @param topFolder 当前递归路径上最顶层的文件夹 name（递归传入）
 */
function findTopFolder(list, name, topFolder = null) {
    for (const item of list) {
        if (item.type === 'folder' && item.children) {
            const folder = topFolder ?? item.name;
            if (item.name === name) {
                return folder;
            }
            const found = findTopFolder(item.children, name, folder);
            if (found) {
                return found;
            }
        }
        else if (item.name === name) {
            return topFolder;
        }
    }
    return null;
}
/**
 * --- 将 selectedNames 中包含的文件夹 name 展开为其内部所有叶子图层 name 的集合 ---
 * @param list 图层列表
 * @param selectedNames 被选中的图层/文件夹 name 列表
 * @param parentSelected 父文件夹是否已被选中（递归传入）
 * @param result 累加结果（递归传入）
 */
function expandSelection(list, selectedNames, parentSelected = false, result = new Set()) {
    for (const item of list) {
        const selected = parentSelected || selectedNames.includes(item.name);
        if (item.type === 'folder' && item.children) {
            expandSelection(item.children, selectedNames, selected, result);
        }
        else if (selected) {
            result.add(item.name);
        }
    }
    return result;
}
export function layerMixin(base) {
    class Mixed extends base {
        layerList = [];
        /** --- layerApplyMode 正在以编程方式修改 canvas 选区，此期间压制 onSelectionChange 的反向 emit --- */
        _layerApplying = false;
        layerUpdateStyle(isDragging) {
            if (!this.access.fabric || !this.access.canvas) {
                return;
            }
            const showControls = this.propBoolean('transform') && !isDragging;
            const style = getComputedStyle(this.element);
            const borderColor = style.getPropertyValue('--cg').trim();
            const cursor = this.props.cursor || 'default';
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
                'hoverCursor': showControls ? 'move' : cursor,
                'moveCursor': showControls ? 'move' : cursor,
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
            const effectiveSelected = expandSelection(this.layerList, this.props.layer);
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
                // --- autoLayer 关闭，或正处于 layerApplyMode 编程选区阶段，均不反向更新 layer prop ---
                if (!this.propBoolean('autoLayer') || this._layerApplying) {
                    return;
                }
                const activeObject = this.access.canvas?.getActiveObject();
                /** --- 获取当前激活图层的名称列表 --- */
                let names;
                if (this.access.fabric && activeObject instanceof this.access.fabric.ActiveSelection) {
                    names = activeObject.getObjects().map(getName);
                }
                else if (activeObject) {
                    names = [getName(activeObject)];
                }
                else {
                    names = [];
                }
                // --- autoLayer='group' 时将叶子 name 映射为最顶层文件夹 name ---
                if (this.props.autoLayer === 'group') {
                    const folderSet = new Set();
                    for (const n of names) {
                        const top = findTopFolder(this.layerList, n);
                        folderSet.add(top ?? n);
                    }
                    names = [...folderSet];
                }
                const prevNames = this.props.layer;
                // --- 若新选中的对象均在当前 layer 作用域内（含文件夹展开），保持 layer 不变 ---
                // --- 例如 layer=['shapes'] 时点击其内部的 rect，不应把 layer 覆写为 ['rect'] ---
                const scope = expandSelection(this.layerList, prevNames);
                if (scope.size > 0 && names.length > 0 && names.every(n => scope.has(n))) {
                    return;
                }
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
            this.access.canvas.on('object:modified', (e) => {
                this.layerUpdateStyle(false);
                // --- 抛出 objectchanged 事件，告知用户对象变换已完成 ---
                const changed = e.target;
                if (!changed) {
                    return;
                }
                const emitChanged = (obj) => {
                    const objName = getName(obj);
                    if (!objName || isArtboard(obj)) {
                        return;
                    }
                    const objEvent = {
                        'detail': {
                            'name': objName,
                            'left': obj.left,
                            'top': obj.top,
                            'scaleX': obj.scaleX,
                            'scaleY': obj.scaleY,
                            'angle': obj.angle,
                            'width': obj.width,
                            'height': obj.height,
                        }
                    };
                    this.emit('objectchanged', objEvent);
                };
                if (this.access.fabric && changed instanceof this.access.fabric.ActiveSelection) {
                    for (const obj of changed.getObjects()) {
                        emitChanged(obj);
                    }
                }
                else {
                    emitChanged(changed);
                }
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
            const addEvent = {
                'detail': { 'type': 'add', 'names': [objName] }
            };
            this.emit('layerlistchange', addEvent);
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
                    if (item.type === 'folder' && item.children) {
                        collect(item.children);
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
            const event = {
                'detail': { 'type': 'add', 'names': [name] }
            };
            this.emit('layerlistchange', event);
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
            const event = {
                'detail': { 'type': 'remove', 'names': [name] }
            };
            this.emit('layerlistchange', event);
        }
        renameLayer(name, title) {
            const found = findItem(this.layerList, name);
            if (!found) {
                return false;
            }
            found.item.title = title;
            const event = {
                'detail': { 'type': 'rename', 'names': [name], 'value': title }
            };
            this.emit('layerlistchange', event);
            return true;
        }
        setLayerVisible(name, visible) {
            const found = findItem(this.layerList, name);
            if (!found) {
                return false;
            }
            found.item.hidden = !visible;
            this.layerApplyMode();
            const event = {
                'detail': { 'type': 'visible', 'names': [name], 'value': visible }
            };
            this.emit('layerlistchange', event);
            return true;
        }
        setLayerLocked(name, locked) {
            const found = findItem(this.layerList, name);
            if (!found) {
                return false;
            }
            found.item.locked = locked;
            this.layerApplyMode();
            const event = {
                'detail': { 'type': 'locked', 'names': [name], 'value': locked }
            };
            this.emit('layerlistchange', event);
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
            const event = {
                'detail': { 'type': 'add', 'names': [name] }
            };
            this.emit('layerlistchange', event);
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
            const moveEvent = {
                'detail': { 'type': 'move', 'names': nameList }
            };
            if (refName === null) {
                // --- 移动到根列表末尾 ---
                this.layerList.push(...movedItems);
            }
            else {
                const ref = findItem(this.layerList, refName);
                if (!ref) {
                    // --- 目标不存在（理论上不应发生），回退到根列表末尾 ---
                    this.layerList.push(...movedItems);
                    this.emit('layerlistchange', moveEvent);
                    return false;
                }
                if (position === 'inside') {
                    if (ref.item.type !== 'folder') {
                        this.layerList.push(...movedItems);
                        this.emit('layerlistchange', moveEvent);
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
            this.emit('layerlistchange', moveEvent);
            return true;
        }
    }
    return Mixed;
}
