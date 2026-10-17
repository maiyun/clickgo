import { ResourceTemplate, ResourceNotFoundError } from '@modelcontextprotocol/server';
const CHUNK_BYTES = 393216;
const MAX_FILE_BYTES = 64 * 1024 * 1024;
function fileInfo(value, taskId) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return false;
    const file = value;
    if (typeof file['fileId'] !== 'string' || !/^[0-9a-f-]{36}$/.test(file['fileId']) ||
        typeof file['fileName'] !== 'string' || !file['fileName'] ||
        typeof file['mimeType'] !== 'string' ||
        typeof file['byteLength'] !== 'number' || !Number.isSafeInteger(file['byteLength']) ||
        file['byteLength'] < 0 || file['byteLength'] > MAX_FILE_BYTES ||
        file['uri'] !== `clickgo-file:///task/${encodeURIComponent(taskId)}/${file['fileId']}` ||
        file['readCommand'] !== 'clickgo.file.read')
        return false;
    return file;
}
export function resultContent(result, taskId) {
    const content = [{ type: 'text', text: JSON.stringify(result) }];
    if (result['ok'] === true && taskId && Array.isArray(result['files'])) {
        for (const value of result['files']) {
            const file = fileInfo(value, taskId);
            if (file === false)
                continue;
            content.push({ type: 'resource_link', uri: file['uri'],
                name: file['fileName'], mimeType: file['mimeType'],
                size: file['byteLength'],
                description: 'File produced by the application export. Read this resource to retrieve the exact bytes before it expires.' });
        }
    }
    return { content, structuredContent: result, isError: result['ok'] !== true };
}
export function registerFiles(server, invoke) {
    server.registerResource('application-export', new ResourceTemplate('clickgo-file:///task/{taskId}/{fileId}', {
        list: undefined,
    }), { title: 'Application export', description: 'Read files explicitly delivered by an App command. Handles expire with the App, Form or Panel; no filesystem path is accepted.' }, async (uri, variables, context) => {
        const taskId = variables['taskId'];
        const fileId = variables['fileId'];
        if (typeof taskId !== 'string' || typeof fileId !== 'string')
            throw new ResourceNotFoundError(uri.href);
        const parts = [];
        let offset = 0;
        let expected;
        for (;;) {
            if (context.mcpReq.signal.aborted)
                throw new ResourceNotFoundError(uri.href, 'File transfer was cancelled');
            const result = await invoke({ method: 'execute', taskId, name: 'clickgo.file.read',
                args: { fileId, offset, length: CHUNK_BYTES } }, context.mcpReq.signal);
            const chunk = result['data'];
            if (result['ok'] !== true || !chunk || typeof chunk !== 'object' || Array.isArray(chunk)) {
                throw new ResourceNotFoundError(uri.href, 'The exported file is no longer available');
            }
            const file = fileInfo(chunk['file'], taskId);
            if (file === false || file['uri'] !== uri.href || file['fileId'] !== fileId ||
                chunk['offset'] !== offset || chunk['encoding'] !== 'base64' || typeof chunk['data'] !== 'string' ||
                chunk['data'].length > CHUNK_BYTES / 3 * 4 ||
                expected && (file['byteLength'] !== expected['byteLength'] || file['mimeType'] !== expected['mimeType'])) {
                throw new ResourceNotFoundError(uri.href, 'Invalid exported file response');
            }
            expected ??= file;
            const bytes = Buffer.from(chunk['data'], 'base64');
            if (bytes.toString('base64') !== chunk['data'] || offset + bytes.length > file['byteLength']) {
                throw new ResourceNotFoundError(uri.href, 'Invalid exported file bytes');
            }
            parts.push(bytes);
            offset += bytes.length;
            if (chunk['nextOffset'] === null) {
                if (offset !== file['byteLength'])
                    throw new ResourceNotFoundError(uri.href, 'Incomplete exported file');
                return { contents: [{ uri: uri.href, mimeType: file['mimeType'],
                            blob: Buffer.concat(parts, offset).toString('base64') }] };
            }
            if (!bytes.length || chunk['nextOffset'] !== offset)
                throw new ResourceNotFoundError(uri.href, 'Invalid file offset');
        }
    });
}
