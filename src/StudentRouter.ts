import { Router } from 'express';
import * as StudentController from './StudentController';
import { upload } from './config/multer';

const router = Router();

router.get('/', StudentController.findManyStudents);
router.post('/nuevo', upload.single('picture'), StudentController.createStudent);
router.get('/nuevo', StudentController.showCreateStudentForm);
router.get('/:id', StudentController.findFirstStudent);
router.get('/:id/edit', StudentController.showEditStudentForm);
router.post('/:id/edit', upload.single('picture'), StudentController.updateStudent);
router.post('/:id/delete', StudentController.deleteStudent);

export default router;