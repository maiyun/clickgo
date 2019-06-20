export let data = {
    starting: false
};

let list = [
    `Last failed login: Sun Jun 16 18:17:59 CST 2019 from 58.242.59.170 on ssh:notty\r\nThere were 691 failed login attempts since the last successful login.\r\nLast login: Sat Jun 15 15:33:26 2019 from 125.119.113.230\r\r\n`,
    `[root@VM_7_11_centos ~]# `,
    `a`, `c`, `m`, `e`, `.`, `s`, `h`, `\r\n`,
    `-bash: acme.sh: command not found\r\n`,
    `[root@VM_7_11_centos ~]# `,
    `c`, `u`, `r`, `l`, ` `, `h`, `t`, `t`, `p`, `s`, `:`, `/`, `/`, `g`, `e`, `t`, `.`, `a`, `c`, `m`, `e`, `.`, `s`, `h`, ` `, `|`, ` `, `s`, `h`, `\r\n`,
    `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\r\n                                 Dload  Upload   Total   Spent    Left  Speed\r\n\r  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0`,
    `\r  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0`,
    `\r100   705    0   705    0     0    672      0 --:--:--  0:00:01 --:--:--   673\r\n`,
    `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\r\n                                 Dload  Upload   Total   Spent    Left  Speed\r\n\r  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0`,
    `\r  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0`,
    `\r  1  184k    1  1917    0     0   1785      0  0:01:45  0:00:01  0:01:44  1784`,
    `\r 11  184k   11 21060    0     0   9224      0  0:00:20  0:00:02  0:00:18  9224`,
    `\r 25  184k   25 48310    0     0  14485      0  0:00:13  0:00:03  0:00:10 14485`,
    `\r 37  184k   37 70212    0     0  17068      0  0:00:11  0:00:04  0:00:07 17066`,
    `\r 41  184k   41 78489    0     0  14437      0  0:00:13  0:00:05  0:00:08 15172`,
    `\r 42  184k   42 81078    0     0  12193      0  0:00:15  0:00:06  0:00:09 14199`,
    `\r 44  184k   44 83837    0     0  11354      0  0:00:16  0:00:07  0:00:09 12309`,
    `\r 45  184k   45 86596    0     0  10327      0  0:00:18  0:00:08  0:00:10  7581`,
    `\r 45  184k   45 86596    0     0   9225      0  0:00:20  0:00:09  0:00:11  3107`,
    `\r 45  184k   45 86596    0     0   8336      0  0:00:22  0:00:10  0:00:12  1637`,
    `\r 47  184k   47 89355    0     0   8087      0  0:00:23  0:00:11  0:00:12  1881`,
    `\r 61  184k   61  113k    0     0   9631      0  0:00:19  0:00:12  0:00:07  6937`,
    `\r100  184k  100  184k    0     0  14436      0  0:00:13  0:00:13 --:--:-- 21734\r100  184k  100  184k    0     0  14436      0  0:00:13  0:00:13 --:--:-- 27583\r\n`,
    `[Sun Jun 16 18:33:20 CST 2019] Installing from online archive.\r\n`,
    `[Sun Jun 16 18:33:20 CST 2019] Downloading https://github.com/Neilpang/acme.sh/archive/master.tar.gz\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] Extracting master.tar.gz\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] \u001b[1;31;40mIt is recommended to install socat first.\u001b[0m\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] \u001b[1;31;40mWe use socat for standalone server if you use standalone mode.\u001b[0m\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] \u001b[1;31;40mIf you don't use standalone mode, just ignore this warning.\u001b[0m\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] Installing to /root/.acme.sh\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] Installed to /root/.acme.sh/acme.sh\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] Installing alias to '/root/.bashrc'\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] OK, Close and reopen your terminal to start using acme.sh\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] Installing alias to '/root/.cshrc'\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] Installing alias to '/root/.tcshrc'\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] Installing cron job\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] Good, bash is found, so change the shebang to use bash as preferred.\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] OK\r\n`,
    `[Sun Jun 16 18:33:23 CST 2019] Install success!\r\n`,
    `[root@VM_7_11_centos ~]# `
];

let term = new Terminal({
    cols: 120
});
let opened = false;

function rand(min: number, max: number): number {
    return min + Math.round(Math.random() * (max - min));
}

export let methods = {
    onOpen: function(this: any) {
        if (!opened) {
            opened = true;
            term.open(this.$refs.terminal);
        }
    },
    start: function(this: any) {
        this.starting = true;
        // --- 模拟终端输入 ---
        term.clear();
        this._start(0, list.length);
    },
    _start: function(this: any, now: number, len: number) {
        if (now === len) {
            this.starting = false;
            return;
        }
        term.write(list[now]);
        setTimeout(() => {
            this._start(now + 1, len);
        }, rand(100, 800));
    }
};