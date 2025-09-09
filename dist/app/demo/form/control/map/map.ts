import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public key = '6901643c38b65f1f9770196343cf72b2';

    public factory = ['tianditu'];

    public keyReal = '';

    public factoryReal = 'google';

    public css = '.label{background:rgba(255,255,255,.7);padding:5px;border:solid 1px #000;position:absolute;transform:translateX(-27px) translateY(5px);}';

    public ntab = 'marker';

    // --- 地图相关 ---

    public lat = 31.223704;

    public lng = 121.366077;

    public zoom = 8;

    public zoomControl = false;

    // --- 日志 ---

    public logs: any[] = [];

    // --- 点 ---

    public markers: any[] = [];

    // --- 折线 ---

    public lines: Array<{
        'path': Array<{
            'lat': number;
            'lng': number;
        }>;
        'drag': boolean;
        'edit': boolean;
    }> = [];

    public lineDrag: boolean = true;

    public lineEdit: boolean = true;

    // --- 区域 ---

    public polygons: any[] = [{
        'path': [{
            'lat': 31.283912,
            'lng': 121.129381
        },
        {
            'lat': 31.083912,
            'lng': 121.329381
        },
        {
            'lat': 31.283912,
            'lng': 121.629381
        },
        {
            'lat': 31.583912,
            'lng': 121.629381
        },
        {
            'lat': 31.583912,
            'lng': 121.029381
        }],
        'strokeColor': 'hsl(210, 100%, 50%)',
        'strokeWeight': 3,
        'fillColor': 'hsl(210, 100%, 50%)',
        'drag': this.lineDrag,
        'edit': this.lineEdit
    }];

    // --- html ---

    public overlays: any[] = [];

    public get dataInfo(): any {
        return (this as any)[this.ntab + 's'];
    }

    /** --- 加载地图 --- */
    public load(): void {
        this.keyReal = this.key;
        this.factoryReal = this.factory[0];
    }

    public async markerAddGaoqiao(wgs: boolean): Promise<void> {
        if (this.markers.length < 3) {
            await clickgo.form.dialog(this, 'Please create at least 3 markers first.');
            return;
        }
        const lat = wgs ? 31.354737 : 31.352569;
        const lng = wgs ? 121.558717 : 121.56302;
        this.markers.push({
            'lat': lat,
            'lng': lng,
            'title': 'Gaoqiao',
            'drag': true
        });
        this.overlays.push({
            'lat': lat,
            'lng': lng,
            'html': '<div class="label">Gaoqiao' + this.markers.length.toString() + '</div>'
        });
    }

    public markerAdd(): void {
        const drag = clickgo.tool.rand(0, 1) ? true : false;
        const lat = 31 + (clickgo.tool.rand(0, 999999) / 1000000);
        const lng = 121 + (clickgo.tool.rand(0, 999999) / 1000000);
        this.markers.push({
            'lat': lat,
            'lng': lng,
            'title': 'Title' + (this.markers.length + 1).toString() + (drag ? ' (drag)' : ''),
            'drag': drag
        });
        this.overlays.push({
            'lat': lat,
            'lng': lng,
            'html': '<div class="label">Overlay' + this.markers.length.toString() + '</div>'
        });
        if (this.markers.length > 2 && !this.lines.length) {
            this.lines.push({
                'path': [{
                    'lat': this.markers[0].lat,
                    'lng': this.markers[0].lng
                }, {
                    'lat': this.markers[1].lat,
                    'lng': this.markers[1].lng
                }, {
                    'lat': this.markers[2].lat,
                    'lng': this.markers[2].lng
                }],
                'drag': this.lineDrag,
                'edit': this.lineEdit
            });
        }
    }

    public markerRemove(): void {
        if (!this.markers.length) {
            return;
        }
        this.markers.splice(-1);
        if (this.markers.length < 3 && this.lines.length) {
            this.lines.splice(-1);
        }
    }

    public markerDrag(): void {
        if (!this.markers[2]) {
            return;
        }
        this.markers[2].drag = !this.markers[2].drag;
        this.markers[2].title = 'Title3' + (this.markers[2].drag ? ' (drag)' : '');
    }

    public lineEvent(key: number, i: number, data: {
        'lat': number;
        'lng': number;
    }): void {
        if (!this.markers.length) {
            return;
        }
        if (!this.lines[0]) {
            return;
        }
        if (!this.lines[0].path[2]) {
            this.lines[0].path.splice(i, 0, data);
        }
        this.markers[0].lat = this.lines[0].path[0].lat;
        this.markers[0].lng = this.lines[0].path[0].lng;
        this.markers[1].lat = this.lines[0].path[1].lat;
        this.markers[1].lng = this.lines[0].path[1].lng;
        this.markers[2].lat = this.lines[0].path[2].lat;
        this.markers[2].lng = this.lines[0].path[2].lng;
    }

    /** --- 记录日志 --- */
    public log(o: string, e: string, data: Record<string, any>): void {
        const d = new Date();
        this.logs.unshift({
            'time': d.getHours().toString() + ':' + d.getMinutes().toString() + ':' + d.getSeconds().toString(),
            'object': o,
            'event': e,
            'data': data
        });
    }

    public click(data: {
        'lat': number;
        'lng': number;
    }): void {
        this.log('map', 'click', data);
    }

    public mc(key: string): void {
        this.log('marker', 'click', {
            'key': key
        });
    }

    public markerEvent(key: string): void {
        const i = parseInt(key);
        this.overlays[i].lat = this.markers[i].lat;
        this.overlays[i].lng = this.markers[i].lng;
        if (i > 2) {
            return;
        }
        if (!this.lines[0]) {
            return;
        }
        this.lines[0].path[i].lat = this.markers[i].lat;
        this.lines[0].path[i].lng = this.markers[i].lng;
    }

}
