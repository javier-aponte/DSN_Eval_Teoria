import { Request, Response } from 'express';
import prisma from './config/database';
import { Contact } from '@prisma/client';
import { uploadFile, deleteFile } from './AWSController';

export const createContact = async (req: Request, res: Response) => {

  let locals = {
    title: 'Inicio',
    code: 0,
    alert: {
      type: '',
      message: '',
      icon: ''
    }
  };

  const { body, file } = req;
  const buffer = file?.buffer;
  const originalName: string = file?.originalname || '';
  const mimeType: string = file?.mimetype || '';

  try {
    const contact: Contact = await prisma.contact.create({
      data: {
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        birthDate: new Date(body.birthDate),
        pictureKey: `images/${originalName}`,
        pictureUrl: `https://jalab09.s3.amazonaws.com/images/${originalName}`
      }
    });

    await uploadFile(buffer, originalName, mimeType);

    locals.alert.type = 'success';
    locals.alert.message = 'Contacto creado exitosamente.';
    locals.alert.icon = 'check-circle';
    locals.code = 201;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    locals.alert.type = 'danger';
    locals.alert.message = 'Error al crear el contacto.';
    locals.alert.icon = 'exclamation-circle';
    locals.code = 500;
  }

  res.status(locals.code).redirect('/');
};

export const updateContact = async (req: Request, res: Response) => {
  const { params, body, file } = req;
  const buffer = file?.buffer;
  const originalName: string = file?.originalname || '';
  const mimeType: string = file?.mimetype || '';

  try {
    const contact: Contact = await prisma.contact.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        birthDate: new Date(body.birthDate),
        pictureKey: `images/${originalName}`,
        pictureUrl: `https://jalab09.s3.amazonaws.com/images/${originalName}`
      }
    });
    const deleteResult = await deleteFile(body.oldPictureKey);
    const uploadResult = await uploadFile(buffer, originalName, mimeType);

  } catch (error: any) {
    res.json(error.message);
  }

  res.status(200).redirect('/');
};

export const deleteContact = async (req: Request, res: Response) => {

  const { params } = req;
  const { body } = req;

  try {
    await prisma.contact.delete({
      where: {
        id: Number(params.id)
      }
    });

    const deleteResult = await deleteFile(body.pictureKey);
    console.log(deleteResult);

  } catch (error: any) {
    res.json(error.message);
  }

  res.status(200).redirect('/');
};

export const findManyContacts = async (req: Request, res: Response) => {

  let locals = {
    title: 'Inicio',
    contacts: [] as Contact[],
    code: 0,
    alert: {
      type: '',
      message: '',
      icon: ''
    }
  };

  try {
    const contacts: Contact[] = await prisma.contact.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    if (contacts.length > 0) {
      locals.contacts = contacts;
    } else {
      locals.alert = {
        type: 'warning',
        message: 'No hay contactos registrados.',
        icon: 'exclamation-triangle'
      };
    }
    locals.code = 200;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    locals.alert = {
      type: 'danger',
      message: 'No se pudo obtener la lista de contactos.',
      icon: 'exclamation-circle'
    };
    locals.code = 500;
  }

  res.status(locals.code).render('list', locals);
};

export const findFirstContact = async (req: Request, res: Response) => {
  const { params } = req;

  try {
    const contact: Contact | null = await prisma.contact.findFirst({
      where: {
        id: Number(params.id)
      }
    });

    res.status(200).render('detail', { title: 'Detalles del Contacto', contact });
  } catch (error: any) {
    res.json(error.message);
  }
};

export const showCreateContact = async (req: Request, res: Response) => {

  let locals = {
    title: 'Nuevo Contacto',
    code: 200,
    alert: {
      type: '',
      message: '',
      icon: ''
    }
  };

  res.status(locals.code).render('create', locals);
};

export const showEditContactForm = async (req: Request, res: Response) => {

  let locals = {
    title: 'Editar Contacto',
    contact: {} as Contact,
    code: 0,
    alert: {
      type: '',
      message: '',
      icon: ''
    }
  };

  try {
    const contact: Contact | null = await prisma.contact.findFirst({
      where: {
        id: Number(req.params.id)
      }
    });

    if (contact) {
      locals.contact = contact;
      locals.code = 200;
    } else {
      locals.alert = {
        type: 'warning',
        message: 'No se encontró el contacto.',
        icon: 'exclamation-triangle'
      };
      locals.code = 404;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }

    locals.alert = {
      type: 'danger',
      message: 'No se pudo obtener la información del contacto.',
      icon: 'exclamation-circle'
    };
    locals.code = 500;
  }

  res.status(locals.code).render('edit', locals);
};