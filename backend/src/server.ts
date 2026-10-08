import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import causasRoutes from './routes/causasRoutes';
import juegosRoutes from './routes/juegosRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import comprasRoutes from './routes/comprasRoutes';
import metodosPagoRoutes from './routes/metodosPagoRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de QuestForGood funcionando' });
});

app.use('/api/causas', causasRoutes);
app.use('/api/juegos', juegosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/metodos-pago', metodosPagoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});