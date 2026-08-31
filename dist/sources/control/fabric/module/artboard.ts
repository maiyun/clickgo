import * as fabric from 'fabric';

import * as mHost from './host';
import * as lLayer from './layer';

/** --- 标识由画板模块创建的对象裁剪矩形 --- */
const ARTBOARD_CLIP_NAME = '__cg_artboard_clip__';

// --- 画板功能模块 ---

export class ArtboardModule implements IArtboardModule {

    /** --- 是否已安排在当前同步批次结束后统一刷新画板 --- */
    private _applyScheduled: boolean = false;

    public constructor(private readonly _host: mHost.TFabricHost) {
    }

    public get access(): mHost.IFabricControl['access'] {
        return this._host.access;
    }

    public get props(): mHost.IFabricControl['props'] {
        return this._host.props;
    }

    public get propNumber(): (name: keyof mHost.IFabricControl['props']) => number {
        return this._host.propNumber as (name: keyof mHost.IFabricControl['props']) => number;
    }

    public get artboard(): IArtboardModule['artboard'] {
        return this._host.artboard;
    }

    public set artboard(value: IArtboardModule['artboard']) {
        this._host.artboard = value;
    }

    public get artboardBeforeRender(): IArtboardModule['artboardBeforeRender'] {
        return this._host.artboardBeforeRender;
    }

    public set artboardBeforeRender(value: IArtboardModule['artboardBeforeRender']) {
        this._host.artboardBeforeRender = value;
    }

    public artboardApplyObjClip(obj: fabric.FabricObject): void {
        if (!this.access.fabric || !this.artboard) {
            return;
        }
        const { left, top, width, height } = this.artboard;
        const clipPath = obj.clipPath;
        if (clipPath && lLayer.getName(clipPath as fabric.FabricObject) === ARTBOARD_CLIP_NAME) {
            clipPath.set({ 'left': left, 'top': top, 'width': width, 'height': height });
            clipPath.setCoords();
        }
        else {
            const clipRect = new this.access.fabric.Rect({
                'left': left,
                'top': top,
                'width': width,
                'height': height,
                /** --- originX/originY 须显式设为 left/top，fabric v7 默认为 center --- */
                'originX': 'left',
                'originY': 'top',
                /** --- absolutePositioned=true 表示 clipPath 使用画布绝对坐标，不受对象自身变换影响 --- */
                'absolutePositioned': true,
            });
            (clipRect as unknown as { 'name': string; }).name = ARTBOARD_CLIP_NAME;
            obj.clipPath = clipRect;
        }
        obj.dirty = true;
    }

    public artboardApply(): void {
        const canvas = this.access.canvas;
        if (!this.access.fabric || !canvas) {
            return;
        }
        const artboardWidth = Math.max(0, this.propNumber('artboardWidth'));
        const artboardHeight = Math.max(0, this.propNumber('artboardHeight'));
        let artboardRect = canvas.getObjects().find(o => lLayer.isArtboard(o));
        if (artboardWidth === 0 || artboardHeight === 0) {
            if (this.artboardBeforeRender) {
                canvas.off('before:render', this.artboardBeforeRender);
                this.artboardBeforeRender = null;
            }
            if (artboardRect) {
                canvas.remove(artboardRect);
            }
            // --- 关闭画板：只清除本模块创建的 clipPath ---
            canvas.forEachObject(obj => {
                if (obj.clipPath && lLayer.getName(obj.clipPath as fabric.FabricObject) === ARTBOARD_CLIP_NAME) {
                    /** --- fabric v7 类型中 clipPath 不含 undefined，用 unknown 中转 --- */
                    (obj as unknown as { 'clipPath': undefined; }).clipPath = undefined;
                    obj.dirty = true;
                }
            });
            canvas.backgroundColor = '';
            this.artboard = null;
            canvas.requestRenderAll();
            return;
        }
        const left = Math.round((canvas.getWidth() - artboardWidth) / 2);
        const top = Math.round((canvas.getHeight() - artboardHeight) / 2);
        this.artboard = {
            'left': left,
            'top': top,
            'width': artboardWidth,
            'height': artboardHeight,
        };
        // --- 为所有现有用户对象应用画板 clipPath ---
        canvas.forEachObject(obj => {
            if (lLayer.isArtboard(obj)) {
                return;
            }
            this.artboardApplyObjClip(obj);
        });
        // --- 复用已有画板矩形，避免尺寸变化时反复触发 object:added/remove ---
        if (artboardRect) {
            artboardRect.set({
                'left': left,
                'top': top,
                'width': artboardWidth,
                'height': artboardHeight,
                'fill': this.props.artboardFill || null,
            });
            artboardRect.setCoords();
        }
        else {
            artboardRect = new this.access.fabric.Rect({
                'left': left,
                'top': top,
                'width': artboardWidth,
                'height': artboardHeight,
                /** --- originX/originY 须显式设为 left/top，fabric v7 默认为 center --- */
                'originX': 'left',
                'originY': 'top',
                'strokeWidth': 0,
                /** --- artboardFill 为空字符串时使用 null 表示完全透明 --- */
                'fill': this.props.artboardFill || null,
                'selectable': false,
                'evented': false,
                'hasControls': false,
                'hasBorders': false,
                'lockMovementX': true,
                'lockMovementY': true,
            });
            (artboardRect as unknown as { 'name': string; }).name = lLayer.ARTBOARD_NAME;
            canvas.add(artboardRect);
            (canvas as any).sendObjectToBack(artboardRect);
        }
        // --- 画板外背景色通过 before:render 绘制，evenodd 裁剪保证不绘制画板内区域 ---
        if (!this.artboardBeforeRender) {
            this.artboardBeforeRender = (e: any): void => {
                const c = this.access.canvas;
                if (!c || !this.artboard || !this.props.artboardBg) {
                    return;
                }
                const zoom = c.getZoom();
                const vpt = c.viewportTransform ?? [1, 0, 0, 1, 0, 0];
                const cw = c.getWidth();
                const ch = c.getHeight();
                const sx = this.artboard.left * zoom + vpt[4];
                const sy = this.artboard.top * zoom + vpt[5];
                const sw = this.artboard.width * zoom;
                const sh = this.artboard.height * zoom;
                const ctx: CanvasRenderingContext2D = e.ctx;
                ctx.save();
                ctx.fillStyle = this.props.artboardBg;
                ctx.beginPath();
                ctx.rect(0, 0, cw, ch);
                ctx.rect(sx, sy, sw, sh);
                ctx.clip('evenodd');
                ctx.fillRect(0, 0, cw, ch);
                ctx.restore();
            };
            canvas.on('before:render', this.artboardBeforeRender);
        }
        canvas.backgroundColor = '';
        canvas.requestRenderAll();
    }

    /**
     * --- 合并同一同步批次内的宽高变更，避免重复遍历画布对象。 ---
     */
    public artboardScheduleApply(): void {
        if (this._applyScheduled) {
            return;
        }
        this._applyScheduled = true;
        queueMicrotask(() => {
            this._applyScheduled = false;
            this.artboardApply();
        });
    }

}

export interface IArtboardModule {

    /** --- 当前画板在 canvas 中的位置与尺寸，未启用画板时为 null --- */
    'artboard': mHost.TArtboard;

    /** --- before:render 监听器引用，在 clearContext 后、renderObjects 前触发，绘制画板外背景色 --- */
    'artboardBeforeRender': ((e: any) => void) | null;

    /**
     * --- 为指定用户对象设置画板裁剪，对象内容被裁剪到画板范围内，控制点不受影响 ---
     * @param obj 要设置裁剪的对象
     */
    artboardApplyObjClip: (obj: fabric.FabricObject) => void;

    /**
     * --- 同步画板状态：居中显示画板区域、更新所有用户对象的 clipPath、绘制外部背景色 ---
     */
    artboardApply: () => void;

}
