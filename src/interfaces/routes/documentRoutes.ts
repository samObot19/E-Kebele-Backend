import { Router } from 'express';
import { DocumentController } from '../controllers/DocumentController';
import { DocumentUseCase } from '../../application/use-cases/document';
import { DocumentRepository } from '../../infrastructure/repositories/DocumentRepository';

const router = Router();

// Dependency injection
const documentRepository = new DocumentRepository();
const documentUseCase = new DocumentUseCase(documentRepository);
const documentController = new DocumentController(documentUseCase);

// Define routes for document management
router.post('/', (req, res) => documentController.createDocument(req, res));
router.get('/', (req, res) => documentController.getDocument(req, res));
router.put('/:id', (req, res) => documentController.updateDocument(req, res));
router.delete('/:id', (req, res) => documentController.deleteDocument(req, res));

export default router;