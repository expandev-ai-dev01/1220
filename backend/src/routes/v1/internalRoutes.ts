import { Router } from 'express';
import * as songController from '@/api/v1/internal/song/controller';
import * as songDetailController from '@/api/v1/internal/song/detail/controller';
import * as songEditController from '@/api/v1/internal/song/edit/controller';
import * as songSearchController from '@/api/v1/internal/song/search/controller';
import * as songTransposeController from '@/api/v1/internal/song/transpose/controller';

const router = Router();

// Song routes - /api/v1/internal/song
router.get('/song', songController.listHandler);
router.post('/song', songController.createHandler);
router.get('/song/search', songSearchController.searchHandler);
router.get('/song/:id', songController.getHandler);
router.get('/song/:id/detail', songDetailController.getDetailHandler);
router.post('/song/:id/transpose', songTransposeController.transposeHandler);
router.put('/song/:id', songController.updateHandler);
router.put('/song/:id/edit', songEditController.editHandler);
router.delete('/song/:id', songController.deleteHandler);

export default router;
