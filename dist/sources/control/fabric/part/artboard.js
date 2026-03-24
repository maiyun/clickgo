import * as lLayer from './layer';
export function artboardMixin(base) {
    class Mixed extends base {
        artboard = null;
        artboardBeforeRender = null;
        artboardApplyObjClip(obj) {
            if (!this.access.fabric || !this.artboard) {
                return;
            }
            const { left, top, width, height } = this.artboard;
            obj.clipPath = new this.access.fabric.Rect({
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
        }
        artboardApply() {
            const canvas = this.access.canvas;
            if (!this.access.fabric || !canvas) {
                return;
            }
            const artboardWidth = this.propNumber('artboardWidth');
            const artboardHeight = this.propNumber('artboardHeight');
            // --- 移除旧的 before:render 监听器 ---
            if (this.artboardBeforeRender) {
                canvas.off('before:render', this.artboardBeforeRender);
                this.artboardBeforeRender = null;
            }
            // --- 移除旧画板矩形（若存在）---
            const oldArtboard = canvas.getObjects().find(o => lLayer.isArtboard(o));
            if (oldArtboard) {
                canvas.remove(oldArtboard);
            }
            if (!artboardWidth || !artboardHeight) {
                // --- 关闭画板：清除所有用户对象的 clipPath ---
                canvas.forEachObject(obj => {
                    if (lLayer.isArtboard(obj)) {
                        return;
                    }
                    /** --- fabric v7 类型中 clipPath 不含 undefined，用 unknown 中转 --- */
                    obj.clipPath = undefined;
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
            // --- 创建画板矩形并压到最底层作为内部背景 ---
            const artboardRect = new this.access.fabric.Rect({
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
            artboardRect.name = lLayer.ARTBOARD_NAME;
            canvas.add(artboardRect);
            canvas.sendObjectToBack(artboardRect);
            // --- 画板外背景色通过 before:render 绘制，evenodd 裁剪保证不绘制画板内区域 ---
            this.artboardBeforeRender = (e) => {
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
                const ctx = e.ctx;
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
            canvas.backgroundColor = '';
            canvas.requestRenderAll();
        }
    }
    return Mixed;
}
