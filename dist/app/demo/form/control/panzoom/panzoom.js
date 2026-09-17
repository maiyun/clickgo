import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    zoom = 1;
    x = 0;
    y = 0;
    edit = false;
    disabled = false;
    mounted = true;
    committed = 0;
    cancelled = 0;
    point = null;
    saved = null;
    /** --- 重绘同一个 Canvas，保留当前视图 --- */
    draw() {
        const canvas = this.refs.canvas;
        const ctx = canvas?.getContext('2d');
        if (!ctx) {
            return;
        }
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 640, 480);
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        for (let x = 0; x <= 640; x += 40) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 480);
        }
        for (let y = 0; y <= 480; y += 40) {
            ctx.moveTo(0, y);
            ctx.lineTo(640, y);
        }
        ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.font = '24px sans-serif';
        ctx.fillText('Canvas 640 × 480', 24, 36);
        if (this.point) {
            ctx.fillStyle = '#6366f1';
            ctx.beginPath();
            ctx.arc(this.point.x, this.point.y, 12, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    /**
     * --- 备份编辑前的内容，第二指加入时可回滚 ---
     * @param event 内容坐标
     */
    editstart(event) {
        this.saved = this.point ? { ...this.point } : null;
        this.editmove(event);
    }
    /**
     * --- 预览编辑，不提交历史 ---
     * @param event 内容坐标
     */
    editmove(event) {
        if (!event.inside) {
            return;
        }
        this.point = { 'x': event.x, 'y': event.y };
        this.draw();
    }
    /** --- 正常抬起时提交一次 --- */
    editend() {
        ++this.committed;
        this.saved = null;
    }
    /** --- 手势取消时回滚预览 --- */
    editcancel() {
        ++this.cancelled;
        this.point = this.saved;
        this.saved = null;
        this.draw();
    }
    onMounted() {
        this.draw();
        this.watch('mounted', async () => {
            await this.nextTick();
            this.draw();
        });
    }
}
