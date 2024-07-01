import express from 'express';
import {
  createDatabase,
  createCollection,
  dropCollection,
  insertDocument,
  fetchDocuments,
  updateDocument,
  deleteDocument,
} from '../controllers/db.controller.js';
import { dbConnectionMiddleware, closeDbConnectionMiddleware } from '../middlewares/db.middleware.js';

const router = express.Router();

router.post('/create-database', dbConnectionMiddleware, createDatabase, closeDbConnectionMiddleware);
router.post('/create-collection', dbConnectionMiddleware, createCollection, closeDbConnectionMiddleware);
router.post('/drop-collection', dbConnectionMiddleware, dropCollection, closeDbConnectionMiddleware);
router.post('/insert-document', dbConnectionMiddleware, insertDocument, closeDbConnectionMiddleware);
router.post('/fetch-documents', dbConnectionMiddleware, fetchDocuments, closeDbConnectionMiddleware);
router.post('/update-document', dbConnectionMiddleware, updateDocument, closeDbConnectionMiddleware);
router.post('/delete-document', dbConnectionMiddleware, deleteDocument, closeDbConnectionMiddleware);

export default router;
