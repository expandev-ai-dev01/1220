/**
 * @api {get} /internal/song/search Search Songs
 * @apiName SearchSongs
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Searches songs by title, artist, category or lyrics content
 *
 * @apiParam {String} [query] Search query string
 * @apiParam {String} [title] Filter by title
 * @apiParam {String} [artist] Filter by artist
 * @apiParam {String} [category] Filter by category
 * @apiParam {String} [lyrics] Search in lyrics content
 *
 * @apiSuccess {Boolean} success Success status
 * @apiSuccess {Array} data Array of matching songs
 *
 * @apiError {String} ValidationError Invalid search parameters
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { songSearch } from '@/services/song';
import { zNullableString } from '@/utils/validation';

/**
 * @summary
 * Searches songs with multiple filter options
 *
 * @function searchHandler
 * @module api/v1/internal/song/search
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @returns {Promise<void>}
 */
export async function searchHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const querySchema = z.object({
    query: zNullableString(200).optional(),
    title: zNullableString(200).optional(),
    artist: zNullableString(100).optional(),
    category: zNullableString(50).optional(),
    lyrics: zNullableString(200).optional(),
  });

  try {
    const validated = querySchema.parse(req.query);
    const data = await songSearch(validated);
    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed: ' + error.errors[0].message));
    } else {
      next(error);
    }
  }
}
