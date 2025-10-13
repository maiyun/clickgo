import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'bg': 'dot' | 'grid';
        'gutter': number | string;
        'alignH': string | undefined;
        'alignV': string | undefined;
    } = {
            'direction': 'h',
            'bg': 'dot',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
        };

    public scaleS = 1;

    public scaleX = 0;

    public scaleY = 0;

    /** --- 当前有的线段 --- */
    public lines: clickgo.control.IObjviewerLine[] = [];

    // --- 供用户调用 ---

    /** --- 添加连接线 --- */
    public addLine(line: clickgo.control.IObjviewerLine): number {
        const rtn = this.lines.push(line) - 1;
        if (!(line.start.obj instanceof HTMLElement)) {
            line.start.obj = line.start.obj.element;
        }
        if (!(line.end.obj instanceof HTMLElement)) {
            line.end.obj = line.end.obj.element;
        }
        clickgo.dom.watchSize(this, line.start.obj, () => {

        });
        clickgo.dom.watchSize(this, line.end.obj, () => {
            if (this.refreshLineTimer) {
                return;
            }
            this.refreshLineTimer = window.setTimeout(() => {
                this.refreshLines();
                this.refreshLineTimer = 0;
            }, 100);
        });
        this.refreshLines();
        return rtn;
    }

    /** --- 删除连接线 --- */
    public removeLine(index: number): void {
        this.lines.splice(index, 1);
        this.refreshLines();
    }

    /** --- 用 name 删除连接线 --- */
    public removeLineByName(name: string): boolean {
        const index = this.lines.findIndex(line => line.name === name);
        if (index === -1) {
            return false;
        }
        this.lines.splice(index, 1);
        this.refreshLines();
        return true;
    }

    /** --- 刷新连线 --- */
    public refreshLines(): void {
        const scaleExec = /scale\(([\d.]+)\)/.exec(this.refs.content.style.transform);
        const scale = scaleExec ? parseFloat(scaleExec[1]) : 1;
        for (const line of this.lines) {
            const startPos = clickgo.dom.getRectPoint(line.start.obj as HTMLElement, this.refs.content, line.start.pos);
            const endPos = clickgo.dom.getRectPoint(line.end.obj as HTMLElement, this.refs.content, line.end.pos);
            startPos.x /= scale;
            startPos.y /= scale;
            endPos.x /= scale;
            endPos.y /= scale;
            /*
            // --- 创建一条平滑的贝塞尔曲线 ---
            // --- 计算控制点，使线条有一个自然的弯曲 ---
            const dx = Math.abs(endPos.x - startPos.x) * 0.5;
            // --- 设置路径数据 ---
            line.path = `M ${startPos.x} ${startPos.y}
                             C ${startPos.x + dx} ${startPos.y},
                               ${endPos.x - dx} ${endPos.y},
                               ${endPos.x} ${endPos.y}`;
            */
            // --- 上面的版本有上下水平问题，新版可上下垂直引出引入 ---

            // --- 根据连接点位置确定控制点的偏移方向 ---
            // --- 对于顶部/底部连接点，控制点应该垂直偏移 ---
            // --- 对于左侧/右侧连接点，控制点应该水平偏移 ---
            const distance = Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));
            const offset = Math.min(distance * 0.5, 150); // 控制点偏移距离

            let startControlX = startPos.x;
            let startControlY = startPos.y;
            let endControlX = endPos.x;
            let endControlY = endPos.y;

            // --- 根据起点位置设置起点控制点 ---
            switch (line.start.pos) {
                case 'lt': {
                    startControlX = startPos.x - offset * 0.7;
                    startControlY = startPos.y - offset * 0.7;
                    break;
                }
                case 't': {
                    startControlY = startPos.y - offset;
                    break;
                }
                case 'tr': {
                    startControlX = startPos.x + offset * 0.7;
                    startControlY = startPos.y - offset * 0.7;
                    break;
                }
                case 'r': {
                    startControlX = startPos.x + offset;
                    break;
                }
                case 'rb': {
                    startControlX = startPos.x + offset * 0.7;
                    startControlY = startPos.y + offset * 0.7;
                    break;
                }
                case 'b': {
                    startControlY = startPos.y + offset;
                    break;
                }
                case 'bl': {
                    startControlX = startPos.x - offset * 0.7;
                    startControlY = startPos.y + offset * 0.7;
                    break;
                }
                case 'l': {
                    startControlX = startPos.x - offset;
                    break;
                }
            }

            // --- 根据终点位置设置终点控制点 ---
            switch (line.end.pos) {
                case 'lt': {
                    endControlX = endPos.x - offset * 0.7;
                    endControlY = endPos.y - offset * 0.7;
                    break;
                }
                case 't': {
                    endControlY = endPos.y - offset;
                    break;
                }
                case 'tr': {
                    endControlX = endPos.x + offset * 0.7;
                    endControlY = endPos.y - offset * 0.7;
                    break;
                }
                case 'r': {
                    endControlX = endPos.x + offset;
                    break;
                }
                case 'rb': {
                    endControlX = endPos.x + offset * 0.7;
                    endControlY = endPos.y + offset * 0.7;
                    break;
                }
                case 'b': {
                    endControlY = endPos.y + offset;
                    break;
                }
                case 'bl': {
                    endControlX = endPos.x - offset * 0.7;
                    endControlY = endPos.y + offset * 0.7;
                    break;
                }
                case 'l': {
                    endControlX = endPos.x - offset;
                    break;
                }
            }

            // 设置路径数据 - 使用三次贝塞尔曲线
            line.path = `M ${startPos.x} ${startPos.y} 
                             C ${startControlX} ${startControlY}, 
                               ${endControlX} ${endControlY}, 
                               ${endPos.x} ${endPos.y}`;

            line.stroke ??= 'solid';
            line.hue ??= '255';
        }
    }

    // --- 供用户调用结束 ---

    /** --- 有些时候要刷新 --- */
    public refreshLineTimer = 0;

    /** --- 绑定缩放事件 --- */
    public scale(oe: MouseEvent | TouchEvent | WheelEvent): void {
        clickgo.dom.bindScale(oe, (e, scale, cpos) => {
            e.preventDefault();
            this.scaleX += cpos.x;
            this.scaleY += cpos.y;
            this.scaleS *= scale;
            if (this.scaleS > 5) {
                this.scaleS = 5;
            }
            else if (this.scaleS < 0.3) {
                this.scaleS = 0.3;
            }
        });
    }

    /** --- 重置缩放/定位 --- */
    public refresh(): void {
        this.scaleS = 1;
        this.scaleX = (this.element.offsetWidth - this.refs.content.offsetWidth) / 2;
        this.scaleY = (this.element.offsetHeight - this.refs.content.offsetHeight) / 2;
    }

    public async onMounted(): Promise<void> {
        await clickgo.tool.sleep(34);
        this.refresh();
    }

}
