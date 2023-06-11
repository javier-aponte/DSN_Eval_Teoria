import { Request, Response } from 'express';
import prisma from './config/database';
import { Student } from '@prisma/client';
import { uploadFile, deleteFile } from './AWSController';

export const createStudent = async (req: Request, res: Response) => {

  const { body, file } = req;
  const buffer = file?.buffer;
  const originalName: string = file?.originalname || '';
  const mimeType: string = file?.mimetype || '';

  try {
    await prisma.student.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        birthDate: body.birthDate,
        email: body.email,
        grade: body.grade,
        S3Key: `${originalName}`,
        S3Url: `https://javucket.s3.amazonaws.com/${originalName}`
      }
    });

    await uploadFile(buffer, originalName, mimeType);

    res.status(201).redirect('/');

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    res.status(500).redirect('/');
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { params, body, file } = req;
  const buffer = file?.buffer;
  const originalName: string = file?.originalname || '';
  const mimeType: string = file?.mimetype || '';

  try {
    await prisma.student.update({
      where: { id: Number(params.id) },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        birthDate: body.birthDate,
        grade: body.grade,
        email: body.email,
        S3Key: `${originalName}`,
        S3Url: `https://javucket.s3.amazonaws.com/${originalName}`
      }
    });

    await deleteFile(body.oldPictureKey);
    await uploadFile(buffer, originalName, mimeType);
    res.status(200).redirect('/');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    res.status(500).redirect('/');
  }
};

export const deleteStudent = async (req: Request, res: Response) => {

  const { params } = req;
  const { body } = req;

  try {
    await prisma.student.delete({
      where: {
        id: Number(params.id)
      }
    });

    const deleteResult = await deleteFile(body.S3Key);
    console.log(deleteResult);


    res.status(200).redirect('/');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    res.status(500).redirect('/');
  }
};

export const findManyStudents = async (req: Request, res: Response) => {

  const query: string = req.query.searchGrade as string;

  let locals = {
    title: 'Lista de Estudiantes',
    students: [] as Student[],
    code: 0,
    alert: {
      type: '',
      message: '',
      icon: ''
    }
  };

  try {
    if (query) {
      const students: Student[] = await prisma.student.findMany({
        where: {
          grade: query
        },
        orderBy: {
          id: 'asc'
        }
      });
      locals.students = students;
    } else {
      const students: Student[] = await prisma.student.findMany({
        orderBy: {
          id: 'asc'
        }
      });
  
      if (students.length > 0) {
        locals.students = students;
      } else {
        locals.alert = {
          type: 'warning',
          message: 'No hay estudiantes registrados.',
          icon: 'exclamation-triangle'
        };
      }
    }
    locals.code = 200;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    locals.alert = {
      type: 'danger',
      message: 'No se pudo obtener la lista de estudiantes.',
      icon: 'exclamation-circle'
    };
    locals.code = 500;
  }

  res.status(locals.code).render('list', locals);
};

export const findFirstStudent = async (req: Request, res: Response) => {
  const { params } = req;

  try {
    const student: Student | null = await prisma.student.findFirst({
      where: {
        id: Number(params.id)
      }
    });

    res.status(200).render('detail', { title: 'Detalles del Estudiante', student });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    res.status(500).redirect('/');
  }
};

export const showCreateStudentForm = async (req: Request, res: Response) => {

  let locals = {
    title: 'Nuevo Estudiante',
    code: 200,
    alert: {
      type: '',
      message: '',
      icon: ''
    }
  };

  res.status(locals.code).render('create', locals);
};

export const showEditStudentForm = async (req: Request, res: Response) => {

  try {
    const student: Student | null = await prisma.student.findFirst({
      where: {
        id: Number(req.params.id)
      }
    });

    res.status(200).render('edit', { title: 'Editar Estudiante', student });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    res.status(500).redirect('/');
  }
};