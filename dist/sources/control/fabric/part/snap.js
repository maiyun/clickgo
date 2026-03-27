import * as pLayer from './layer';
export function snapMixin(base) {
    class Mixed extends base {
        /** --- 当前活跃的辅助线列表 --- */
        _guides = [];
        /** --- after:render 渲染处理器引用 --- */
        _snapRenderHandler = null;
        /** --- before:render 渲染处理器引用 --- */
        _snapBeforeRenderHandler = null;
        // --- 吸附辅助线绘制 ---
        /**
         * --- 在主画布上绘制吸附辅助线（青色实线） ---
         * @param ctx 主画布 2D 渲染上下文
         */
        _drawGuides(ctx) {
            if (this._guides.length === 0 || !this.access.canvas) {
                return;
            }
            const zoom = this.access.canvas.getZoom();
            const vpt = this.access.canvas.viewportTransform ?? [1, 0, 0, 1, 0, 0];
            const cw = this.access.canvas.getWidth();
            const ch = this.access.canvas.getHeight();
            const dpr = this.access.canvas.getRetinaScaling();
            ctx.save();
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 1 / dpr;
            ctx.setLineDash([]);
            ctx.beginPath();
            for (const g of this._guides) {
                if (g.dir === 'h') {
                    const sy = (Math.floor((g.pos * zoom + vpt[5]) * dpr) + 0.5) / dpr;
                    ctx.moveTo(0, sy);
                    ctx.lineTo(cw, sy);
                }
                else {
                    const sx = (Math.floor((g.pos * zoom + vpt[4]) * dpr) + 0.5) / dpr;
                    ctx.moveTo(sx, 0);
                    ctx.lineTo(sx, ch);
                }
            }
            ctx.stroke();
            ctx.restore();
        }
        // --- 初始化 ---
        snapSetup() {
            if (!this.access.canvas) {
                return;
            }
            // --- 注册 before:render：清除 contextTop 残影，防止缩放时出现双重网格 ---
            this._snapBeforeRenderHandler = () => {
                const ctxTop = this.access.canvas?.contextTop;
                if (ctxTop) {
                    this.access.canvas.clearContext(ctxTop);
                }
            };
            this.access.canvas.on('before:render', this._snapBeforeRenderHandler);
            // --- 注册 after:render 绘制吸附辅助线 ---
            this._snapRenderHandler = (e) => {
                const ctx = e.ctx;
                this._drawGuides(ctx);
            };
            this.access.canvas.on('after:render', this._snapRenderHandler);
            // --- 注册 object:moving 处理 fabric 内置拖拽的吸附 ---
            this.access.canvas.on('object:moving', (e) => {
                this.snapApply(e.target);
            });
            // --- mouse:up 时清除辅助线 ---
            this.access.canvas.on('mouse:up', () => {
                this.snapClearGuides();
            });
        }
        // --- 吸附计算与应用 ---
        /**
         * --- 对目标对象应用像素取整和吸附调整 ---
         * @param target fabric 对象或 ActiveSelection
         * @param rawLeft 原始 left 坐标（PS 拖拽模式下传入，用于保留亚像素累计值）
         * @param rawTop 原始 top 坐标
         */
        snapApply(target, rawLeft, rawTop) {
            if (!this.access.canvas || !this.access.fabric) {
                return;
            }
            if (pLayer.isArtboard(target)) {
                return;
            }
            let left = rawLeft ?? (target.left ?? 0);
            let top = rawTop ?? (target.top ?? 0);
            // --- 先设置位置以获取准确的边界框 ---
            target.set({ 'left': left, 'top': top });
            target.setCoords();
            if (!this.propBoolean('snap')) {
                this._guides = [];
                return;
            }
            const threshold = this.propNumber('snapThreshold') || 5;
            const zoom = this.access.canvas.getZoom();
            // --- 吸附阈值从屏幕像素转换为 canvas 坐标单位 ---
            const th = threshold / zoom;
            // --- 收集移动对象集合（排除 ActiveSelection 子对象） ---
            const movingSet = new Set();
            movingSet.add(target);
            if (target instanceof this.access.fabric.ActiveSelection) {
                for (const child of target.getObjects()) {
                    movingSet.add(child);
                }
            }
            // --- 获取移动对象的边界 ---
            const bound = target.getBoundingRect();
            const bLeft = bound.left;
            const bTop = bound.top;
            const bRight = bound.left + bound.width;
            const bBottom = bound.top + bound.height;
            const bCenterX = bound.left + bound.width / 2;
            const bCenterY = bound.top + bound.height / 2;
            // --- 吸附候选位置 ---
            const vCandidates = [];
            const hCandidates = [];
            // --- 画板边缘和中心 ---
            if (this.artboard) {
                const ab = this.artboard;
                vCandidates.push(ab.left, ab.left + ab.width, ab.left + ab.width / 2);
                hCandidates.push(ab.top, ab.top + ab.height, ab.top + ab.height / 2);
            }
            // --- 其他可见对象的边缘和中心 ---
            this.access.canvas.forEachObject((other) => {
                if (movingSet.has(other) || pLayer.isArtboard(other) || !other.visible) {
                    return;
                }
                const ob = other.getBoundingRect();
                vCandidates.push(ob.left, ob.left + ob.width, ob.left + ob.width / 2);
                hCandidates.push(ob.top, ob.top + ob.height, ob.top + ob.height / 2);
            });
            const objRefX = [bLeft, bRight, bCenterX];
            const objRefY = [bTop, bBottom, bCenterY];
            // --- 第一遍：找最小吸附距离 ---
            let bestDx = null;
            let bestDxDist = Infinity;
            let bestDy = null;
            let bestDyDist = Infinity;
            for (const rx of objRefX) {
                for (const cx of vCandidates) {
                    const dist = Math.abs(rx - cx);
                    if (dist <= th && dist < bestDxDist) {
                        bestDxDist = dist;
                        bestDx = cx - rx;
                    }
                }
            }
            for (const ry of objRefY) {
                for (const cy of hCandidates) {
                    const dist = Math.abs(ry - cy);
                    if (dist <= th && dist < bestDyDist) {
                        bestDyDist = dist;
                        bestDy = cy - ry;
                    }
                }
            }
            // --- 应用吸附偏移 ---
            if (bestDx !== null) {
                left += bestDx;
            }
            if (bestDy !== null) {
                top += bestDy;
            }
            target.set({ 'left': left, 'top': top });
            target.setCoords();
            // --- 第二遍：收集吸附后匹配的所有辅助线 ---
            const guides = [];
            if (bestDx !== null) {
                const vSet = new Set();
                for (const rx of objRefX) {
                    const snappedX = rx + bestDx;
                    for (const cx of vCandidates) {
                        if (Math.abs(snappedX - cx) < 0.5) {
                            vSet.add(cx);
                        }
                    }
                }
                for (const vx of vSet) {
                    guides.push({ 'dir': 'v', 'pos': vx });
                }
            }
            if (bestDy !== null) {
                const hSet = new Set();
                for (const ry of objRefY) {
                    const snappedY = ry + bestDy;
                    for (const cy of hCandidates) {
                        if (Math.abs(snappedY - cy) < 0.5) {
                            hSet.add(cy);
                        }
                    }
                }
                for (const hy of hSet) {
                    guides.push({ 'dir': 'h', 'pos': hy });
                }
            }
            this._guides = guides;
        }
        /**
         * --- 清除当前显示的所有吸附辅助线 ---
         */
        snapClearGuides() {
            if (this._guides.length > 0) {
                this._guides = [];
                this.access.canvas?.requestRenderAll();
            }
        }
    }
    return Mixed;
}
