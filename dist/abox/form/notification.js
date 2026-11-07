export function createNotificationRuntime(deps) {
    const { lCore, lTool } = deps;
    let alertBottom = 0;
    let alertId = 0;
    function alert(content, type) {
        const nid = ++alertId;
        const timeout = 3000;
        const el = document.createElement('div');
        const y = alertBottom;
        el.classList.add('cg-alert-wrap');
        el.classList.add('cg-' + (type ?? 'default'));
        el.setAttribute('data-alertid', nid.toString());
        el.style.transform = `translateY(${y + 10}px)`;
        el.style.opacity = '0';
        el.innerHTML = `<div class="cg-alert-content">` +
            `<div class="cg-alert-icon"></div>` +
            `<div>${lTool.escapeHTML(content)}</div>` +
            '</div>';
        deps.getElements().alert.appendChild(el);
        alertBottom -= el.offsetHeight + 10;
        requestAnimationFrame(function () {
            el.style.transform = `translateY(${y}px)`;
            el.style.opacity = '1';
            const timer = window.setTimeout(function () {
                clearTimeout(timer);
                const alertHeight = el.offsetHeight;
                el.style.opacity = '0';
                setTimeout(function () {
                    alertBottom += alertHeight + 10;
                    const alertElementList = document.getElementsByClassName('cg-alert-wrap');
                    let needSub = false;
                    for (const alertElement of alertElementList) {
                        if (alertElement === el) {
                            needSub = true;
                            continue;
                        }
                        if (needSub) {
                            alertElement.style.transform = alertElement.style.transform.replace(/translateY\(([-0-9]+)px\)/, function (t, t1) {
                                return `translateY(${parseInt(t1) + alertHeight + 10}px)`;
                            });
                        }
                    }
                    el.remove();
                }, 100);
            }, timeout);
        });
        return nid;
    }
    let notifyId = 0;
    const hideTimers = new Map();
    function scheduleHide(id, delay) {
        const deadline = Date.now() + Math.max(0, delay);
        const existing = hideTimers.get(id);
        if (existing && existing.deadline <= deadline)
            return;
        if (existing)
            clearTimeout(existing.timer);
        const timer = window.setTimeout(() => {
            hideTimers.delete(id);
            hideNotify(id);
        }, delay);
        hideTimers.set(id, { deadline, timer });
    }
    let notifyResizeObserver;
    function refreshNotifyPosition() {
        const children = deps.getElements().notify.children;
        if (!children.length) {
            return;
        }
        const rtl = lTool.lang.getDirection(lCore.config.locale) === 'rtl';
        const area = lCore.getAvailArea();
        let y = area.top + area.height - window.innerHeight - 10;
        const x = rtl ? area.left + 10 : area.left + area.width - window.innerWidth - 10;
        const positions = [];
        for (let i = 0; i < children.length; ++i) {
            const el = children[i];
            const entering = el.dataset.state === 'entering';
            positions.push({ el, transform: `translateY(${y}px) translateX(${entering ? (rtl ? -280 : 280) : x}px)` });
            if (i + 1 < children.length) {
                y -= el.offsetHeight + 10;
            }
        }
        for (const { el, transform } of positions) {
            if (el.style.transform !== transform) {
                el.style.transform = transform;
            }
        }
    }
    function notify(opt) {
        if (opt.note && !opt.content) {
            opt.content = 'Notify';
        }
        const nid = ++notifyId;
        let timeout = 5_000;
        const maxTimeout = 60_000 * 10;
        if (opt.timeout !== undefined) {
            if (opt.timeout < 0) {
                timeout = 5_000;
            }
            else if ((opt.timeout === 0) || (opt.timeout > maxTimeout)) {
                timeout = maxTimeout;
            }
            else {
                timeout = opt.timeout;
            }
        }
        if (opt.progress && !opt.type) {
            opt.type = 'progress';
        }
        const el = document.createElement('div');
        el.classList.add('cg-notify-wrap');
        el.setAttribute('data-notifyid', nid.toString());
        el.dataset.state = 'entering';
        el.style.opacity = '0';
        el.classList.add((opt.title && opt.content) ? 'cg-notify-full' : 'cg-notify-only');
        el.innerHTML = `<div class="cg-notify-icon cg-${lTool.escapeHTML(opt.type ?? 'primary')}"></div>` +
            '<div style="flex: 1;">' +
            (opt.title ?
                `<div class="cg-notify-title">${lTool.escapeHTML(opt.title)}</div>` :
                '') +
            (opt.content ?
                `<div class="cg-notify-content">${lTool.escapeHTML(opt.content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>')}</div>` :
                '') +
            (opt.note ?
                `<div class="cg-notify-note">${lTool.escapeHTML(opt.note)}</div>` :
                '') +
            (opt.progress ?
                '<div class="cg-notify-progress"></div>' :
                '') +
            '</div>';
        if (opt.icon) {
            el.childNodes.item(0).style.background = 'url(' + opt.icon + ')';
            el.childNodes.item(0).style.backgroundSize = '14px';
        }
        deps.getElements().notify.appendChild(el);
        notifyResizeObserver ??= new ResizeObserver(refreshNotifyPosition);
        notifyResizeObserver.observe(el);
        refreshNotifyPosition();
        requestAnimationFrame(function () {
            if (!el.isConnected || (el.dataset.state === 'leaving')) {
                return;
            }
            el.dataset.state = 'visible';
            refreshNotifyPosition();
            el.style.opacity = '1';
            scheduleHide(nid, timeout);
        });
        return nid;
    }
    function notifyProgress(notifyId, per) {
        const el = deps.getElements().notify.querySelector(`[data-notifyid="${notifyId}"]`);
        if (!el) {
            return;
        }
        const progress = el.querySelector('.cg-notify-progress');
        if (!progress) {
            return;
        }
        if (per > 100) {
            per = 100;
        }
        else if (per === 1) {
            const o = parseFloat(progress.style.width);
            if (o > 1) {
                per = 100;
            }
        }
        if (per === 100) {
            progress.style.transitionDelay = '.1s';
        }
        progress.style.width = (per < 1 ? per * 100 : per).toString() + '%';
    }
    function notifyContent(notifyId, opt) {
        const el = deps.getElements().notify.querySelector(`[data-notifyid="${notifyId}"]`);
        if (!el) {
            return;
        }
        if (opt.title) {
            const title = el.querySelector('.cg-notify-title');
            if (!title) {
                return;
            }
            title.innerHTML = lTool.escapeHTML(opt.title);
        }
        if (opt.content) {
            const content = el.querySelector('.cg-notify-content');
            if (!content) {
                return;
            }
            content.innerHTML = lTool.escapeHTML(opt.content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br>');
        }
        if (opt.note) {
            const note = el.querySelector('.cg-notify-note');
            if (!note) {
                return;
            }
            note.innerHTML = lTool.escapeHTML(opt.note);
        }
        if (opt.progress !== undefined) {
            notifyProgress(notifyId, opt.progress);
        }
        if (opt.timeout) {
            scheduleHide(notifyId, opt.timeout);
        }
        refreshNotifyPosition();
    }
    function hideNotify(notifyId) {
        const el = deps.getElements().notify.querySelector(`[data-notifyid="${notifyId}"]`);
        if (!el || (el.dataset.state === 'leaving')) {
            return;
        }
        el.dataset.state = 'leaving';
        const scheduled = hideTimers.get(notifyId);
        if (scheduled)
            clearTimeout(scheduled.timer);
        hideTimers.delete(notifyId);
        el.style.opacity = '0';
        setTimeout(function () {
            notifyResizeObserver?.unobserve(el);
            el.remove();
            refreshNotifyPosition();
        }, 100);
    }
    return { alert, refreshNotifyPosition, notify, notifyProgress, notifyContent, hideNotify };
}
