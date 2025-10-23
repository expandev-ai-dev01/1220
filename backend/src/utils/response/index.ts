/**
 * @summary
 * Standard success response format
 *
 * @function successResponse
 * @module utils/response
 *
 * @param {T} data - Response data
 * @param {object} [metadata] - Optional metadata
 *
 * @returns {object} Formatted success response
 */
export function successResponse<T>(data: T, metadata?: any): object {
  return {
    success: true,
    data,
    ...(metadata && { metadata: { ...metadata, timestamp: new Date().toISOString() } }),
  };
}

/**
 * @summary
 * Standard error response format
 *
 * @function errorResponse
 * @module utils/response
 *
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 *
 * @returns {object} Formatted error response
 */
export function errorResponse(message: string, code?: string): object {
  return {
    success: false,
    error: {
      message,
      ...(code && { code }),
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * @summary
 * Standard list response format with pagination
 *
 * @function listResponse
 * @module utils/response
 *
 * @param {T[]} data - Array of data items
 * @param {number} total - Total count of items
 * @param {number} page - Current page number
 * @param {number} pageSize - Items per page
 *
 * @returns {object} Formatted list response
 */
export function listResponse<T>(data: T[], total: number, page: number, pageSize: number): object {
  return {
    success: true,
    data,
    metadata: {
      page,
      pageSize,
      total,
      hasNext: page * pageSize < total,
      hasPrevious: page > 1,
      timestamp: new Date().toISOString(),
    },
  };
}
