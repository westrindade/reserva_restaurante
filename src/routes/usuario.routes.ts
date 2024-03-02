import express from 'express';
import { BaseRoutesConfig } from './base.routes.config';
import { validationResult } from 'express-validator';
import { UsuarioController } from '../controllers/usuarioController';
//import path from 'path';

export class UsuarioRoutes extends BaseRoutesConfig  {

  constructor(app: express.Application) {
    super(app, 'UsuarioRoutes');
  }

  configureRoutes(): express.Application {

    console.info(`[usuario.routes] PROFILE`);

    this.app.route('/buscarPorEmail').get((req: express.Request, res: express.Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()){
        console.info(`[usuario.routes] PROFILE: ${errors}`);

        return res.json({ success: false, hcaptcha: false, errors: errors.array() });
      }

      return UsuarioController.buscarPorEmail(req,res);
    })

    return this.app;
  }
}
// const router = express.Router();
// const dir = 'usuario';
// var rota = __dirname.replace("router","")


// const paginas = ['form/cadastrar','form/result-list','consultar'];
// paginas.forEach((pagina) => {
//     router.get(`/${pagina}`, (req, res) => {
//       //res.sendFile(path.join(rota, 'views', 'usuario', 'form', `${pagina}.pug`));
//       res.render(`${dir}/${pagina}`, { /* adicione quaisquer dados necessários aqui */ });
//     });
//   });
