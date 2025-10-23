/**
 * @api {get} /internal/song List Songs
 * @apiName ListSongs
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all songs in the catalog
 *
 * @apiSuccess {Boolean} success Success status
 * @apiSuccess {Array} data Array of songs
 *
 * @apiError {String} ServerError Internal server error
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { songList, songCreate, songGet, songUpdate, songDelete } from '@/services/song';
import { zString, zNullableString } from '@/utils/validation';

/**
 * @summary
 * Lists all songs
 *
 * @function listHandler
 * @module api/v1/internal/song
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @returns {Promise<void>}
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await songList();
    res.json(successResponse(data));
  } catch (error: any) {
    next(error);
  }
}

/**
 * @api {post} /internal/song Create Song
 * @apiName CreateSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new song with lyrics and chords
 *
 * @apiParam {String} title Song title (max 200 characters)
 * @apiParam {String} artist Artist name (max 100 characters)
 * @apiParam {String} lyrics Song lyrics with chords (max 5000 characters)
 * @apiParam {String} [originalKey] Original musical key (max 10 characters)
 * @apiParam {String} [category] Musical category (max 50 characters)
 *
 * @apiSuccess {Boolean} success Success status
 * @apiSuccess {Object} data Created song
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const bodySchema = z.object({
    title: zString.max(200),
    artist: zString.max(100),
    lyrics: zString.max(5000),
    originalKey: zNullableString(10),
    category: zNullableString(50),
  });

  try {
    const validated = bodySchema.parse(req.body);
    const data = await songCreate(validated);
    res.status(201).json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json(errorResponse('Validation failed: ' + error.errors[0].message));
    } else {
      next(error);
    }
  }
}

/**
 * @api {get} /internal/song/:id Get Song
 * @apiName GetSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Gets a specific song by ID
 *
 * @apiParam {String} id Song identifier
 *
 * @apiSuccess {Boolean} success Success status
 * @apiSuccess {Object} data Song details
 *
 * @apiError {String} NotFound Song not found
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const paramsSchema = z.object({
    id: zString,
  });

  try {
    const validated = paramsSchema.parse(req.params);
    const data = await songGet(validated.id);
    res.json(successResponse(data));
  } catch (error: any) {
    if (error.message === 'Song not found') {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}

/**
 * @api {put} /internal/song/:id Update Song
 * @apiName UpdateSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing song
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
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
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

/**
 * @api {delete} /internal/song/:id Delete Song
 * @apiName DeleteSong
 * @apiGroup Song
 * @apiVersion 1.0.0
 *
 * @apiDescription Deletes a song
 *
 * @apiParam {String} id Song identifier
 *
 * @apiSuccess {Boolean} success Success status
 *
 * @apiError {String} NotFound Song not found
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const paramsSchema = z.object({
    id: zString,
  });

  try {
    const validated = paramsSchema.parse(req.params);
    await songDelete(validated.id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Song not found') {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
