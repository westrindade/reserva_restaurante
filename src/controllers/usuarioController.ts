//import { Usuario } from './../model/usuario';
import express from 'express';
import { check } from 'express-validator';
import { UsuarioService } from '../service/UsuarioService';

export class UsuarioController {
  
  static validate(method: string): any[] {
    switch (method) {
      case 'consultar': {
        return [
          check('email', 'E-mail é obrigatório.').notEmpty(),
          check('email')
            .optional({ checkFalsy: true })
            .custom(async (value, { req }) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const email = value//.replace(/\D/g, '');
              if (!emailRegex.test(email)) {
                console.error(`[Usuario] E-mail ${email} com formato inválido.`);
                throw new Error('E-mail com formato inválido.');
              }
              return true;
            })
        ];
      }
      default:
        throw new Error('Method not implemented!');
    }
  }

  static async buscarPorEmail(req: express.Request, res: express.Response) {
    const email = req.body.email//.replace(/\D/g, '');
    try{
      const result = await UsuarioService.buscarPorEmail(email);
      return res.json({ success: true, result: result });
    } catch {
      const errorOnConsult = [{ msg: 'Ocorreu um erro ao tentar consultar. Tente Novamente.' }];
      return res.json({ success: false, errors: errorOnConsult });
    }
  }
}