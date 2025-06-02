import { Router, RequestHandler } from 'express';
import { DocumentController } from '../controllers/DocumentController';
import { DocumentUseCase } from '../../application/use-cases/document';
import { DocumentRepository } from '../../infrastructure/repositories/DocumentRepository';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { requireKebeleAdmin, requireAnyAdmin, checkDocumentAccess } from '../middlewares/roleMiddleware';

const router = Router();

// Dependency injection
const documentRepository = new DocumentRepository();
const documentUseCase = new DocumentUseCase(documentRepository);
const documentController = new DocumentController(documentUseCase);

// All routes require authentication
router.use(authenticateJWT as RequestHandler);

// Create document - Only Kebele and Goxe admins can create documents
router.post('/', 
  requireAnyAdmin as RequestHandler,
  (req, res) => documentController.createDocument(req, res)
);

// Get all documents - Only admins can see all documents
router.get('/',
  requireAnyAdmin as RequestHandler,
  (req, res) => documentController.getDocument(req, res)
);

// Get documents by user ID - Requires document access authorization
router.get('/user/:userId',
  checkDocumentAccess as RequestHandler,
  (req, res) => documentController.getDocumentsByUserId(req, res)
);

// Update document - Only admins can update documents
router.put('/:id',
  requireAnyAdmin as RequestHandler,
  (req, res) => documentController.updateDocument(req, res)
);

// Delete document - Only Kebele admin can delete documents
router.delete('/:id',
  requireKebeleAdmin as RequestHandler,
  (req, res) => documentController.deleteDocument(req, res)
);

export default router;