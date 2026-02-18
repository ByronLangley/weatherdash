const isDev = process.env.NODE_ENV === "development";

export const logger = {
  debug(context: string, message: string, data?: unknown) {
    if (isDev) {
      console.debug(`[DEBUG] [${context}] ${message}`, data ?? "");
    }
  },

  info(context: string, message: string, data?: unknown) {
    if (isDev) {
      console.log(`[INFO] [${context}] ${message}`, data ?? "");
    }
  },

  warn(context: string, message: string, data?: unknown) {
    console.warn(`[WARN] [${context}] ${message}`, data ?? "");
  },

  error(context: string, message: string, data?: unknown) {
    console.error(`[ERROR] [${context}] ${message}`, data ?? "");
  },
};
