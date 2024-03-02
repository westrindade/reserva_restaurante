import express from 'express';
import useragent from 'express-useragent';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import manifest from './rev-manifest.json';
import { BaseRoutesConfig } from './routes/base.routes.config';
import { UsuarioRoutes } from './routes/usuario.routes';

//dotenv.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV}`), debug: true, override: true });
dotenv.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV}`), encoding: 'utf8', debug: true, override: true });
const app = express();

//
const routes : Array<BaseRoutesConfig> = []

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());

//rotas js,img e css
//app.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css',express.static(path.join(__dirname, 'scss')));
app.use('/bundle.js', express.static(path.join(__dirname, `public/js/app/${manifest['bundle.js']}`)));

app.use('/js', express.static(path.join(__dirname, 'node_modules/axios/dist')));
app.use('/css', express.static(path.join(__dirname.replace("\src",""), 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
//rotas views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//rotas post
routes.push(new UsuarioRoutes(app));

//arquivo config
const envPath = path.join(__dirname, `.env.development`);
dotenv.config({ path: envPath, debug: true, override: true });
//const port = 3000;
if (!process.env.PORT || !process.env.NODE_ENV) {
  process.exit(1);
}
const port:number = parseInt(process.env.PORT as string, 10);;

/////
app.get('/', (req, res) => {
  res.render('index', { title: 'Reserva Rápida' });
});

app.listen(port, () => {
  routes.forEach((route: BaseRoutesConfig) => {
    route.configureRoutes();
    console.info(`===>[index] Routes configured for ${route.getName()}`);
  });
  console.info(`Servidor rodando em http://localhost:${port}`);
});

