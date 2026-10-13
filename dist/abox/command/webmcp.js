import { copyJson } from './json.js';
export function createWebPublisher(runtime) {
    const publications = new Map();
    function disconnect(taskId) {
        const publication = publications.get(taskId);
        publications.delete(taskId);
        for (const controller of publication?.tools.values() ?? [])
            controller.abort();
        publication?.tools.clear();
    }
    function refresh(taskId) {
        const publication = publications.get(taskId);
        if (!publication)
            return;
        publication.status = 'registering';
        const pending = publication.pending.then(async () => {
            if (publications.get(taskId) !== publication)
                return false;
            const entries = runtime.getCommands(taskId);
            const selected = new Set(entries);
            for (const [entry, controller] of publication.tools) {
                if (!selected.has(entry)) {
                    controller.abort();
                    publication.tools.delete(entry);
                }
            }
            let registered = true;
            for (const entry of entries) {
                if (publications.get(taskId) !== publication)
                    return false;
                if (publication.tools.has(entry) || !runtime.isCurrent(taskId, entry))
                    continue;
                const controller = new AbortController();
                publication.tools.set(entry, controller);
                try {
                    await publication.context.registerTool({
                        'name': `cg_${taskId}_${entry.id}_${entry.metadata.name}`.slice(0, 128),
                        'description': entry.metadata.description,
                        'inputSchema': copyJson(entry.metadata.inputSchema),
                        'annotations': {
                            'readOnlyHint': entry.metadata.annotations?.readOnlyHint ?? false,
                            'consequentialHint': entry.metadata.annotations?.consequentialHint ??
                                entry.metadata.annotations?.destructiveHint ?? false,
                            'untrustedContentHint': entry.metadata.annotations?.untrustedContentHint ?? false,
                        },
                        'execute': async (args, options) => {
                            if (publications.get(taskId) !== publication || controller.signal.aborted ||
                                !runtime.isCurrent(taskId, entry)) {
                                return JSON.stringify({ 'ok': false, 'error': { 'code': 'not-found', 'message': 'Command was not found' } });
                            }
                            return JSON.stringify(await runtime.execute(taskId, entry, args, options));
                        },
                    }, { 'signal': controller.signal });
                    if (publications.get(taskId) !== publication || !runtime.isCurrent(taskId, entry)) {
                        controller.abort();
                        publication.tools.delete(entry);
                        registered = false;
                    }
                }
                catch {
                    controller.abort();
                    publication.tools.delete(entry);
                    registered = false;
                }
            }
            if (publications.get(taskId) === publication && publication.pending === pending) {
                publication.status = registered ? (publication.tools.size ? 'ready' : 'idle') : 'failed';
            }
            return registered;
        });
        publication.pending = pending;
    }
    function publish(taskId, context) {
        let publication = publications.get(taskId);
        if (publication && publication.context !== context) {
            disconnect(taskId);
            publication = undefined;
        }
        if (!publication) {
            publication = { 'context': context, 'tools': new Map(), 'pending': Promise.resolve(true), 'status': 'idle' };
            publications.set(taskId, publication);
        }
        refresh(taskId);
        return publication;
    }
    function describe(taskIds) {
        let status = 'idle';
        const publishedTaskIds = [];
        for (const taskId of taskIds) {
            const publication = publications.get(taskId);
            if (!publication)
                continue;
            if (publication.status === 'failed')
                status = 'failed';
            else if (status !== 'failed' && publication.status === 'registering')
                status = 'registering';
            else if (status === 'idle' && publication.tools.size)
                status = 'ready';
            if (publication.status === 'ready' && publication.tools.size)
                publishedTaskIds.push(taskId);
        }
        return { 'registrationStatus': status, 'publishedTaskIds': publishedTaskIds };
    }
    return { publish, refresh, disconnect, describe };
}
