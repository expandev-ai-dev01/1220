import { Router } from 'express';
import * as songController from '@/api/v1/internal/song/controller';

const router = Router();

// Song routes - /api/v1/internal/song
router.get('/song', songController.listHandler);
router.post('/song', songController.createHandler);
router.get('/song/:id', songController.getHandler);
router.put('/song/:id', songController.updateHandler);
router.delete('/song/:id', songController.deleteHandler);

export default router;
