import { z } from 'zod';

/**
 * @summary
 * Common Zod validation schemas for reuse across the application
 *
 * @module utils/validation
 */

// String validations
export const zString = z.string().min(1, 'Field is required');
export const zNullableString = (maxLength?: number) => {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema.nullable();
};

export const zName = z.string().min(1).max(200);
export const zNullableDescription = z.string().max(500).nullable();

// Number validations
export const zNumber = z.number();
export const zPositiveNumber = z.number().positive();
export const zNullableNumber = z.number().nullable();

// ID validations
export const zId = z.coerce.number().int().positive();
export const zNullableId = z.coerce.number().int().positive().nullable();

// Boolean validations
export const zBoolean = z.boolean();
export const zBit = z.coerce.number().int().min(0).max(1);

// Date validations
export const zDate = z.coerce.date();
export const zDateString = z.string().datetime();
export const zNullableDate = z.coerce.date().nullable();

// Email validation
export const zEmail = z.string().email();

// URL validation
export const zUrl = z.string().url();

/**
 * @summary
 * Validates if a value is a valid enum value
 *
 * @function validateEnum
 * @module utils/validation
 *
 * @param {any} value - Value to validate
 * @param {object} enumObject - Enum object to validate against
 *
 * @returns {boolean} True if valid enum value
 */
export function validateEnum(value: any, enumObject: any): boolean {
  return Object.values(enumObject).includes(value);
}
