import type { IUpdateDriver, IUpdateProgress } from '../lib/update.js';

const finite = (value: number): number => Number.isFinite(value) ? Math.max(0, value) : 0;

let pending: Promise<IUpdateDriver | false> | undefined;

export function load(onError: () => void, onProgress: (progress: IUpdateProgress) => void): Promise<IUpdateDriver | false> {
    if (pending) return pending;
    pending = (async () => {
        try {
            const module = await import('electron-updater');
            const updater = module.default.autoUpdater;
            updater.autoDownload = false;
            updater.autoInstallOnAppQuit = false;
            updater.on('error', error => { updater.logger?.error(error); onError(); });
            updater.on('download-progress', progress => { onProgress({
                percent: Math.min(100, finite(progress.percent)),
                transferred: finite(progress.transferred), total: finite(progress.total), bytesPerSecond: finite(progress.bytesPerSecond),
            }); });
            return {
                async check() {
                    try {
                        const result = await updater.checkForUpdates();
                        if (!result) return null;
                        return { available: result.isUpdateAvailable, version: result.updateInfo.version };
                    }
                    catch (error) { updater.logger?.error(error); return false; }
                },
                async download() {
                    try { return (await updater.downloadUpdate()).length > 0; }
                    catch (error) { updater.logger?.error(error); return false; }
                },
                install() {
                    try { updater.quitAndInstall(false, true); return true; }
                    catch (error) { updater.logger?.error(error); return false; }
                },
            } satisfies IUpdateDriver;
        }
        catch { pending = undefined; return false; }
    })();
    return pending;
}
