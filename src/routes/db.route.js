import express from 'express';
import { createCollection, dropCollection, dropDatabase, insertDocument, fetchDocuments, updateDocument, deleteDocument } from '../controllers/db.controller.js';
import { validateApiKey } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create-collection', validateApiKey, createCollection);
router.post('/insert-document', validateApiKey, insertDocument);
router.post('/fetch-documents', validateApiKey, fetchDocuments);
router.post('/update-document', validateApiKey, updateDocument);
router.post('/delete-document', validateApiKey, deleteDocument);
router.post('/drop-collection', validateApiKey, dropCollection);
router.post('/drop-database', validateApiKey, dropDatabase);

export default router;