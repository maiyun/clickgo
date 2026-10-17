export function createRuntime(options) {
    const { core: lCore, task: lTask, native: lNative, files: lFile, data: lData, webMcp: lWebMcp, guide: lGuide } = options;
    function init() {
        getWebMcpContext();
    }
    function success(data, files) {
        return files === undefined ? { 'ok': true, 'data': data } : { 'ok': true, 'data': data, 'files': files };
    }
    function failure(code, message) {
        return { 'ok': false, 'error': { 'code': code, 'message': message } };
    }
    function releaseFile(current, fileId) {
        return lFile.release(owner(current), fileId);
    }
    const registries = new Map();
    let entryId = 0;
    let webMcpStatus;
    const webPublisher = lWebMcp.create({
        'getCommands': (taskId) => [...registries.get(taskId)?.values() ?? []].filter(entry => entry.exposed),
        'isCurrent': (taskId, entry) => registries.get(taskId)?.get(entry.metadata.name) === entry,
        'execute': (taskId, entry, args, options) => executeAgent(taskId, entry.metadata.name, args, options),
    });
    function owner(current) {
        if (typeof current === 'string') {
            return { 'taskId': current, 'formId': '', 'panelId': '' };
        }
        return {
            'taskId': current.taskId, 'formId': 'formId' in current ? current.formId : '',
            'panelId': 'panelId' in current ? current.panelId : '',
        };
    }
    function disabledReason(taskId, entry, ignoreRunning = false) {
        const task = lTask.getOrigin(taskId);
        const form = task?.forms[entry.formId];
        if (!task || task.ending || entry.formId && (!form || form.closed)) {
            return 'Owner is no longer available';
        }
        if (entry.panelId && !form?.vapp._container.querySelector(`[data-panel-id="${entry.panelId}"]`)) {
            return 'Owner is no longer available';
        }
        if (!ignoreRunning && !entry.concurrent && entry.controllers.size) {
            return 'Command is running';
        }
        const state = entry.enabled ? entry.enabled() : true;
        if (state === true) {
            return '';
        }
        return typeof state === 'string' && state ? state : 'Command is disabled';
    }
    function register(current, definition) {
        if (definition?.name === lFile.READ_COMMAND) {
            return false;
        }
        return registerDefinition(current, definition);
    }
    function registerDefinition(current, definition) {
        const { taskId, formId, panelId } = owner(current);
        const task = lTask.getOrigin(taskId);
        const form = task?.forms[formId];
        if (!task || task.ending || formId && (!form || form.closed) ||
            panelId && !form?.vapp._container.querySelector(`[data-panel-id="${panelId}"]`)) {
            return false;
        }
        const metadata = lData.readMetadata(definition);
        const registry = registries.get(taskId);
        if (metadata === false || registry?.has(metadata.name)) {
            return false;
        }
        const entry = {
            'id': ++entryId,
            'metadata': metadata,
            'formId': formId,
            'panelId': panelId,
            'exposed': definition.exposed === true,
            'concurrent': definition.concurrent === true,
            'permissions': [...definition.permissions ?? []],
            'enabled': definition.enabled,
            'execute': definition.execute,
            'controllers': new Set(),
        };
        const target = registry ?? new Map();
        target.set(metadata.name, entry);
        registries.set(taskId, target);
        if (entry.exposed) {
            publishWebMcp(taskId);
        }
        return true;
    }
    function unregister(current, name) {
        const { taskId, formId, panelId } = owner(current);
        const registry = registries.get(taskId);
        const entry = registry?.get(name);
        if (!entry || formId && entry.formId !== formId || panelId && entry.panelId !== panelId) {
            return false;
        }
        registry.delete(name);
        for (const controller of entry.controllers) {
            controller.abort();
        }
        if (!registry.size) {
            registries.delete(taskId);
        }
        if (entry.exposed) {
            webPublisher.refresh(taskId);
        }
        return true;
    }
    function clear(current) {
        const { taskId, formId, panelId } = owner(current);
        clearOwner(taskId, formId, panelId);
    }
    function clearOwner(taskId, formId = '', panelId = '') {
        lFile.clear({ taskId, formId, panelId });
        const registry = registries.get(taskId);
        for (const [name, entry] of registry ?? []) {
            if ((!formId || entry.formId === formId) && (!panelId || entry.panelId === panelId)) {
                unregister(taskId, name);
            }
        }
        if (!formId) {
            disconnectWebMcp(taskId);
        }
    }
    function list(current) {
        const { taskId } = owner(current);
        const infos = [];
        for (const entry of registries.get(taskId)?.values() ?? []) {
            let reason;
            try {
                reason = disabledReason(taskId, entry);
            }
            catch {
                reason = 'Availability check failed';
            }
            infos.push({
                ...lData.copy(entry.metadata), 'taskId': taskId, 'formId': entry.formId, 'exposed': entry.exposed,
                'panelId': entry.panelId,
                'enabled': !reason, 'disabledReason': reason, 'running': entry.controllers.size,
            });
        }
        return infos;
    }
    function listTasks() {
        return lTask.getList().filter(info => {
            const task = lTask.getOrigin(info.id);
            return task && !task.ending;
        }).map(info => ({ 'id': info.id, 'name': info.name }));
    }
    async function getAgentInfo(current, options = {}) {
        const taskId = current === undefined ? null : owner(current).taskId;
        if (taskId !== null && !listTasks().some(app => app.id === taskId)) {
            return null;
        }
        let http = null;
        if (options.includeMcpCredentials) {
            if (current === undefined) {
                return false;
            }
            const info = await lNative.getMcpInfo(current);
            if (info === false) {
                return false;
            }
            http = info;
        }
        const native = await lNative.getCommandEntry();
        const apps = listTasks().filter(app => taskId === null || app.id === taskId);
        if (taskId !== null && !apps.length) {
            return null;
        }
        const location = document.location;
        const url = location?.protocol === 'http:' || location?.protocol === 'https:' ?
            `${location.origin}${location.pathname}` : null;
        const supported = getWebMcpContext() !== null;
        const publication = supported ? webPublisher.describe(apps.map(app => app.id)) : null;
        return {
            'schemaVersion': 1, 'apps': apps, 'targetTaskId': taskId,
            'browser': { 'url': url, 'api': "window['clickgo']['command']" },
            'webMcp': {
                'supported': supported, 'status': supported ? 'ready' : 'unsupported',
                'registrationStatus': publication?.registrationStatus ?? null,
                'publishedTaskIds': publication?.publishedTaskIds ?? [],
            },
            'native': native, 'http': http,
        };
    }
    async function getAgentGuide(current, options = {}) {
        const info = await getAgentInfo(current, options);
        if (info === null || info === false) {
            return info;
        }
        return lGuide.format(info);
    }
    async function run(taskId, name, args, signal, source, exposedOnly) {
        const entry = registries.get(taskId)?.get(name);
        if (!entry || exposedOnly && !entry.exposed) {
            return failure('not-found', 'Command was not found');
        }
        if (signal?.aborted) {
            return failure('cancelled', 'Command was cancelled');
        }
        const controller = new AbortController();
        const createdFiles = [];
        const retainedFiles = new Set();
        const abort = () => {
            controller.abort();
        };
        try {
            const input = lData.readInput(args, entry.metadata.inputSchema);
            if (!input.ok) {
                return input;
            }
            const reason = disabledReason(taskId, entry);
            if (reason) {
                return failure('unavailable', reason);
            }
            entry.controllers.add(controller);
            signal?.addEventListener('abort', abort, { 'once': true });
            for (const permission of entry.permissions) {
                const allowed = (await lTask.checkPermission(taskId, permission))[0];
                if (controller.signal.aborted) {
                    return failure('cancelled', 'Command was cancelled');
                }
                if (!allowed) {
                    return failure('permission-denied', 'Command permission was denied');
                }
            }
            if (controller.signal.aborted || registries.get(taskId)?.get(name) !== entry) {
                return failure('cancelled', 'Command was cancelled');
            }
            const currentReason = disabledReason(taskId, entry, true);
            if (currentReason) {
                return failure('unavailable', currentReason);
            }
            const result = await entry.execute(input.data, {
                'taskId': taskId, 'formId': entry.formId, 'panelId': entry.panelId,
                'source': source, 'signal': controller.signal,
                'createFile': (blob, options) => {
                    if (controller.signal.aborted || !entry.controllers.has(controller) ||
                        registries.get(taskId)?.get(name) !== entry) {
                        return false;
                    }
                    const file = lFile.create({ 'taskId': taskId, 'formId': entry.formId, 'panelId': entry.panelId }, blob, options);
                    if (file !== false) {
                        createdFiles.push(file.fileId);
                    }
                    return file;
                },
            });
            if (controller.signal.aborted) {
                return failure('cancelled', 'Command was cancelled');
            }
            const output = lData.readResult(result, entry.metadata.outputSchema);
            if (output.ok && output.files?.length) {
                const files = lFile.commit(taskId, output.files, entry.exposed);
                if (files === false) {
                    return failure('invalid-output', 'Command returned an unavailable file');
                }
                output.files = files;
                if (entry.exposed) {
                    ensureFileReader(taskId);
                }
                for (const file of files) {
                    retainedFiles.add(file.fileId);
                }
            }
            return output;
        }
        catch {
            return failure('execution-failed', 'Command execution failed');
        }
        finally {
            for (const fileId of createdFiles) {
                if (!retainedFiles.has(fileId)) {
                    lFile.remove(taskId, fileId);
                }
            }
            entry.controllers.delete(controller);
            signal?.removeEventListener('abort', abort);
        }
    }
    function ensureFileReader(taskId) {
        if (registries.get(taskId)?.has(lFile.READ_COMMAND)) {
            return;
        }
        registerDefinition(taskId, {
            'name': lFile.READ_COMMAND, 'title': 'Read an exported file',
            'description': 'Read the exact file returned in a command result files list. Use its fileId, start at byte offset 0 and use readChunkSize as length. Decode each Base64 data segment and append bytes until nextOffset is null. Files expire after 10 minutes or when their Panel, Form or App closes. Keep binary content out of chat; do not regenerate a file because a browser download event was missed.',
            'inputSchema': {
                'type': 'object', 'properties': {
                    'fileId': { 'type': 'string', 'minLength': 1, 'maxLength': 64 },
                    'offset': { 'type': 'integer', 'minimum': 0, 'default': 0 },
                    'length': { 'type': 'integer', 'minimum': 1, 'maximum': lFile.MAX_CHUNK_BYTES,
                        'default': lFile.DEFAULT_CHUNK_BYTES },
                }, 'required': ['fileId'], 'additionalProperties': false,
            },
            'exposed': true, 'concurrent': true,
            'annotations': { 'readOnlyHint': true, 'idempotentHint': true, 'openWorldHint': false,
                'untrustedContentHint': true },
            'execute': async (args, context) => {
                const chunk = await lFile.read(taskId, args['fileId'], {
                    'offset': args['offset'], 'length': args['length'],
                    'signal': context.signal,
                });
                return chunk === false ? failure('file-unavailable', 'The exported file expired or its owner closed')
                    : success({ ...chunk, 'file': { ...chunk.file } });
            },
        });
    }
    function execute(current, name, args = {}, options = {}) {
        return run(owner(current).taskId, name, args, options.signal, 'user', false);
    }
    function executeAgent(taskId, name, args = {}, options = {}) {
        return run(taskId, name, args, options.signal, 'agent', true);
    }
    function createBridge(current) {
        const { taskId } = owner(current);
        return Object.freeze({
            'taskId': taskId,
            'list': () => list(taskId).filter(info => info.exposed),
            'execute': (name, args = {}, options = {}) => executeAgent(taskId, name, args, options),
        });
    }
    function createPageBridge() {
        return Object.freeze({
            'getAgentInfo': (taskId) => getAgentInfo(taskId),
            'getAgentGuide': (taskId) => getAgentGuide(taskId),
            'listTasks': listTasks,
            'list': (taskId) => {
                const task = lTask.getOrigin(taskId);
                return task && !task.ending ? list(taskId).filter(info => info.exposed) : [];
            },
            'execute': executeAgent,
        });
    }
    function getWebMcpContext() {
        const context = document.modelContext;
        const status = typeof context?.registerTool === 'function' ? 'ready' : 'unsupported';
        if (webMcpStatus !== status) {
            webMcpStatus = status;
            lCore.trigger('webMcpStatusChanged', status).catch(() => { });
        }
        return status === 'ready' ? context ?? null : null;
    }
    function publishWebMcp(taskId) {
        const task = lTask.getOrigin(taskId);
        const context = getWebMcpContext();
        if (!task || task.ending || context === null) {
            return null;
        }
        return webPublisher.publish(taskId, context);
    }
    async function connectWebMcp(current) {
        const publication = publishWebMcp(owner(current).taskId);
        return publication?.pending ?? false;
    }
    function disconnectWebMcp(current) {
        const { taskId } = owner(current);
        webPublisher.disconnect(taskId);
    }
    return { init, success, failure, releaseFile, register, unregister, clear, clearOwner, list, listTasks, getAgentInfo, getAgentGuide, execute, executeAgent, createBridge, createPageBridge, connectWebMcp, disconnectWebMcp };
}
