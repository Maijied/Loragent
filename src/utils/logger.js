/**
 * Loragent Standard Logger
 * Provides structured logging for CLI and background tasks.
 */

export const logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    success: (msg) => console.log(`[SUCCESS] ${msg}`),
    debug: (msg) => {
        if (process.env.DEBUG) {
            console.debug(`[DEBUG] ${msg}`);
        }
    }
};

export default logger;
