import express from 'express';
import { AppDataSource } from './database';
import routes from './routes/routes';

const app = express();
app.use(express.json());
app.use(routes);

AppDataSource.initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida!');

    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((error) => console.log(error));
