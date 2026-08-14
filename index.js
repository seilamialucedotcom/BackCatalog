import app from './app.js';
import sequelize from './src/config/database.js';

let databaseReady;

async function ensureDatabaseConnection() {
  if (!databaseReady) {
    databaseReady = (async () => {
      await sequelize.authenticate();
      await sequelize.sync();
    })();
    try {
      await databaseReady;
      console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
      databaseReady = undefined;
      throw error;
    }
  }
  return databaseReady;
}

async function handler(req, res) {
  try {
    await ensureDatabaseConnection();
    return app(req, res);
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    return res.status(503).json({ message: 'No se pudo conectar a la base de datos.' });
  }
}

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  sequelize.sync().then(() => {
    app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}.`));
  }).catch((error) => console.error('No se pudo iniciar el servidor:', error));
}

export default process.env.VERCEL ? handler : app;
