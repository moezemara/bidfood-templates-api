import express from 'express';
import {ExtractInvoice} from './ExtractorController.js';
import MulterUploader from './utils/multer.js'

const router = express.Router()

router.post('/Extract', MulterUploader, ExtractInvoice)

export default router;