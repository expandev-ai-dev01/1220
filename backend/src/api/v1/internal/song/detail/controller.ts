/**
 * @api {get} /internal/song/:id/detail Get Song Detail
 * @apiName GetSongDetail
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Gets detailed view of a specific song for display
 *
 * @apiParam {String} id Song identifier
 *
 * @apiSuccess {Boolean} success Success status
 * @apiSuccess {Object} data Song detail with formatted content
 *
 * @apiError {String} NotFound Song not found
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { songGetDetail } from '@/services/song';
import { zString } from '@/utils/validation';

/**
 * @summary
 * Gets detailed song view for display
 *
 * @function getDetailHandler
 * @module api/v1/internal/song/detail
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @returns {Promise<void>}
 */
export async function getDetailHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const paramsSchema = z.object({
    id: zString,
  });

  try {
    const validated = paramsSchema.parse(req.params);
    const data = await songGetDetail(validated.id);
    res.json(successResponse(data));
  } catch (error: any) {
    if (error.message === 'Song not found') {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
