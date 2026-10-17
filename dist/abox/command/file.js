export function createFileStore(options) {
    const { task: lTask, tool: lTool, readCommand: READ_COMMAND, defaultChunkBytes: DEFAULT_CHUNK_BYTES, maxChunkBytes: MAX_CHUNK_BYTES } = options;
    const MAX_FILE_BYTES = 64 * 1024 * 1024;
    const MAX_TASK_BYTES = 128 * 1024 * 1024;
    const MAX_TASK_FILES = 8;
    const FILE_LIFETIME = 10 * 60 * 1000;
    const files = new Map();
    function create(owner, blob, options) {
        if (!(blob instanceof Blob) || blob.size > MAX_FILE_BYTES || !options ||
            typeof options.fileName !== 'string' || !options.fileName.trim() || options.fileName.length > 255 ||
            /[\\/:*?"<>|\x00-\x1f]/.test(options.fileName)) {
            return false;
        }
        const mimeType = options.mimeType ?? (blob.type || 'application/octet-stream');
        if (typeof mimeType !== 'string' || mimeType.length > 255 || /[\x00-\x1f\x7f]/.test(mimeType)) {
            return false;
        }
        if (!/^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/.test(mimeType.split(';')[0].trim())) {
            return false;
        }
        const current = files.get(owner.taskId) ?? new Map();
        let bytes = 0;
        for (const file of current.values()) {
            if (file.info.expiresAt <= Date.now()) {
                remove(owner.taskId, file.info.fileId);
            }
            else {
                bytes += file.info.byteLength;
            }
        }
        if (current.size >= MAX_TASK_FILES || bytes + blob.size > MAX_TASK_BYTES) {
            return false;
        }
        const fileId = crypto.randomUUID();
        const createdAt = Date.now();
        const info = {
            'fileId': fileId, 'fileName': options.fileName, 'mimeType': mimeType, 'byteLength': blob.size,
            'createdAt': createdAt, 'expiresAt': createdAt + FILE_LIFETIME,
            'uri': `clickgo-file:///task/${encodeURIComponent(owner.taskId)}/${fileId}`,
            'readCommand': READ_COMMAND, 'readChunkSize': MAX_CHUNK_BYTES,
        };
        const timer = lTask.createTimer(owner.taskId, () => {
            remove(owner.taskId, fileId);
        }, FILE_LIFETIME, { 'formId': owner.formId || undefined, 'count': 1 });
        if (!timer) {
            return false;
        }
        current.set(fileId, { 'owner': { ...owner }, 'info': info, 'blob': blob.slice(0, blob.size, mimeType),
            'timer': timer, 'exposed': false });
        files.set(owner.taskId, current);
        return { ...info };
    }
    function commit(taskId, requested, exposed) {
        const selected = [];
        for (const info of requested) {
            const file = files.get(taskId)?.get(info.fileId);
            if (!file || file.info.expiresAt <= Date.now() || selected.includes(file)) {
                return false;
            }
            selected.push(file);
        }
        for (const file of selected) {
            file.exposed ||= exposed;
        }
        return selected.map(file => ({ ...file.info }));
    }
    async function read(taskId, fileId, options = {}) {
        const file = files.get(taskId)?.get(fileId);
        const offset = options.offset ?? 0;
        const length = options.length ?? DEFAULT_CHUNK_BYTES;
        if (!file?.exposed || file.info.expiresAt <= Date.now() || options.signal?.aborted ||
            !Number.isSafeInteger(offset) || offset < 0 || offset > file.blob.size ||
            !Number.isSafeInteger(length) || length < 1 || length > MAX_CHUNK_BYTES) {
            return false;
        }
        const end = Math.min(file.blob.size, offset + length);
        const encoded = await lTool.blob2DataUrl(file.blob.slice(offset, end)).catch(() => false);
        if (encoded === false || options.signal?.aborted || file.info.expiresAt <= Date.now() ||
            files.get(taskId)?.get(fileId) !== file) {
            return false;
        }
        return { 'file': { ...file.info }, 'offset': offset, 'nextOffset': end < file.blob.size ? end : null,
            'encoding': 'base64', 'data': encoded.slice(encoded.indexOf(',') + 1) };
    }
    function remove(taskId, fileId) {
        const current = files.get(taskId);
        const file = current?.get(fileId);
        if (!file) {
            return;
        }
        lTask.removeTimer(taskId, file.timer);
        current.delete(fileId);
        if (!current.size) {
            files.delete(taskId);
        }
    }
    function release(owner, fileId) {
        const file = files.get(owner.taskId)?.get(fileId);
        if (!file || owner.formId && file.owner.formId !== owner.formId ||
            owner.panelId && file.owner.panelId !== owner.panelId) {
            return false;
        }
        remove(owner.taskId, fileId);
        return true;
    }
    function clear(owner) {
        for (const file of files.get(owner.taskId)?.values() ?? []) {
            if ((!owner.formId || file.owner.formId === owner.formId) &&
                (!owner.panelId || file.owner.panelId === owner.panelId)) {
                remove(owner.taskId, file.info.fileId);
            }
        }
    }
    return { create, commit, read, remove, release, clear };
}
