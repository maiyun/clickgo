import * as litertLoader from '@litert/loader';

declare global {
    type ILoader = litertLoader.ILoader;
    type ILoaderUrl = litertLoader.ILoaderUrl;

    const loader: typeof litertLoader.loader;
    const __invoke: typeof litertLoader.__invoke;
    const __preprocess: typeof litertLoader.__preprocess;
}