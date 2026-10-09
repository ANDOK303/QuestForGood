import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import causasRoutes from './routes/causasRoutes';
import juegosRoutes from './routes/juegosRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import comprasRoutes from './routes/comprasRoutes';
import metodosPagoRoutes from './routes/metodosPagoRoutes';
import estadisticasRoutes from './routes/estadisticasRoutes';
import uploadsRoutes from './routes/uploadsRoutes';
import perfilRoutes from './routes/perfilRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de QuestForGood funcionando' });
});

app.use('/api/causas', causasRoutes);
app.use('/api/juegos', juegosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/metodos-pago', metodosPagoRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/perfil', perfilRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});