export function createNativeEventDispatcher(options) {
    let running = false;
    let requested = false;
    const resume = () => {
        requested = true;
        if (running || !options.ready())
            return;
        running = true;
        void (async () => {
            try {
                while (requested && options.ready()) {
                    requested = false;
                    const events = await options.read();
                    if (events === null || events === false)
                        break;
                    for (const event of events)
                        await options.dispatch(event);
                    if (events.length)
                        requested = true;
                }
            }
            catch (error) {
                requested = false;
                options.error(error);
            }
            finally {
                running = false;
                if (requested && options.ready())
                    resume();
            }
        })().catch(options.error);
    };
    return resume;
}
