import { Router } from 'express';
import * as ContactController from './ContactController';
import { upload } from './config/multer';

const router = Router();

router.get('/', ContactController.findManyContacts);
router.post('/nuevo', upload.single('picture'), ContactController.createContact);
router.get('/nuevo', ContactController.showCreateContact);
router.get('/:id', ContactController.findFirstContact);
router.get('/:id/edit', ContactController.showEditContactForm);
router.post('/:id/edit', upload.single('picture'), ContactController.updateContact);
router.post('/:id/delete', ContactController.deleteContact);

export default router;