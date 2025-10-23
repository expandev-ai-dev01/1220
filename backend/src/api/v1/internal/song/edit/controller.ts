/**
 * @api {put} /internal/song/:id/edit Edit Song
 * @apiName EditSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Edits an existing song's lyrics and chords
 *
 * @apiParam {String} id Song identifier
 * @apiParam {String} [title] Song title (max 200 characters)
 * @apiParam {String} [artist] Artist name (max 100 characters)
 * @apiParam {String} [lyrics] Song lyrics with chords (max 5000 characters)
 * @apiParam {String} [originalKey] Original musical key (max 10 characters)
 * @apiParam {String} [category] Musical category (max 50 characters)
 *
 * @apiSuccess {Boolean} success Success status
 * @apiSuccess {Object} data Updated song
 *
 * @apiError {String} NotFound Song not found
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { songUpdate } from '@/services/song';
import { zString, zNullableString } from '@/utils/validation';

/**
 * @summary
 * Edits an existing song with validation
 *
 * @function editHandler
 * @module api/v1/internal/song/edit
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @returns {Promise<void>}
 */
export async function editHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const paramsSchema = z.object({
    id: zString,
  });

  const bodySchema = z.object({
    title: zString.max(200).optional(),
    artist: zString.max(100).optional(),
    lyrics: zString.max(5000).optional(),
    originalKey: zNullableString(10).optional(),
    category: zNullableString(50).optional(),
  });

  try {
    const validatedParams = paramsSchema.parse(req.params);
    const validatedBody = bodySchema.parse(req.body);

    const data = await songUpdate({ id: validatedParams.id, ...validatedBody });
    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed: ' + error.errors[0].message));
    } else if (error.message === 'Song not found') {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
