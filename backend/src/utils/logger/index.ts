/**
 * @summary
 * Simple logging utility for application-wide logging
 *
 * @module utils/logger
 */

export const logger = {
  /**
   * @summary
   * Log info level message
   *
   * @param {string} message - Log message
   * @param {any} [meta] - Additional metadata
   */
  info: (message: string, meta?: any): void => {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },

  /**
   * @summary
   * Log error level message
   *
   * @param {string} message - Log message
   * @param {any} [meta] - Additional metadata
   */
  error: (message: string, meta?: any): void => {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },

  /**
   * @summary
   * Log warning level message
   *
   * @param {string} message - Log message
   * @param {any} [meta] - Additional metadata
   */
  warn: (message: string, meta?: any): void => {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },

  /**
   * @summary
   * Log debug level message
   *
   * @param {string} message - Log message
   * @param {any} [meta] - Additional metadata
   */
  debug: (message: string, meta?: any): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        JSON.stringify({
          level: 'debug',
          message,
          timestamp: new Date().toISOString(),
          ...meta,
        })
      );
    }
  },
};
