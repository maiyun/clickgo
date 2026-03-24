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

// --- 控件类 ---

type TConstructor<T = clickgo.control.AbstractControl &
    pCore.ICore
> = abstract new (...args: any[]) => T;

export function layerMixin<
    TBase extends TConstructor<clickgo.control.AbstractControl>
>(base: TBase): TBase & TConstructor<ILayerMixin> {

    abstract class Mixed extends (base as unknown as TConstructor) implements ILayerMixin {

        public layerList: ILayerMixin['layerList'] = [];

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
            this.access.canvas.forEachObject(obj => {
                if (isArtboard(obj)) {
                    return;
                }
                // --- pan / zoom / marquee 模式下所有对象均不可交互 ---
                if (this.props.mode === 'pan' || this.props.mode === 'zoom' || this.props.mode === 'marquee') {
                    obj.set({ 'evented': false, 'selectable': false });
                    return;
                }
                // --- autoLayer: 所有对象可交互；否则仅 layer 数组中的对象响应 ---
                const isActive = this.propBoolean('autoLayer') || this.props.layer.includes(getName(obj));
                obj.set({ 'evented': isActive, 'selectable': isActive });
            });
            // --- 将 layer prop 对应的对象同步为 canvas 激活对象 ---
            if (this.props.layer.length > 0) {
                const allObjs = this.access.canvas.getObjects();
                const targetObjs = this.props.layer
                    .map(n => allObjs.find(o => getName(o) === n))
                    .filter((o): o is fabric.FabricObject => !!o);
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

    }

    return Mixed as unknown as TBase & TConstructor<ILayerMixin>;
}

export interface ILayerMixin {

    'layerList': Array<{
        'type': 'layer' | 'folder';
        /** --- 图层 name 属性值 --- */
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
     * --- 根据 mode / layer / selector prop 同步画布内所有对象的交互状态 ---
     */
    layerApplyMode(): void;

}
