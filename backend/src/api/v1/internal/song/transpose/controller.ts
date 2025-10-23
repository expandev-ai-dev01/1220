/**
 * @api {post} /internal/song/:id/transpose Transpose Song
 * @apiName TransposeSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Transposes song chords to a different musical key
 *
 * @apiParam {String} id Song identifier
 * @apiParam {Number} semitones Number of semitones to transpose (-11 to 11)
 *
 * @apiSuccess {Boolean} success Success status
 * @apiSuccess {Object} data Transposed song with new chords
 *
 * @apiError {String} NotFound Song not found
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { songTranspose } from '@/services/song';
import { zString } from '@/utils/validation';

/**
 * @summary
 * Transposes song chords to a different key
 *
 * @function transposeHandler
 * @module api/v1/internal/song/transpose
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @returns {Promise<void>}
 */
export async function transposeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const paramsSchema = z.object({
    id: zString,
  });

  const bodySchema = z.object({
    semitones: z.number().int().min(-11).max(11),
  });

  try {
    const validatedParams = paramsSchema.parse(req.params);
    const validatedBody = bodySchema.parse(req.body);

    const data = await songTranspose(validatedParams.id, validatedBody.semitones);
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
