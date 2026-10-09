import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import causasRoutes from './routes/causasRoutes';
import juegosRoutes from './routes/juegosRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import comprasRoutes from './routes/comprasRoutes';
import metodosPagoRoutes from './routes/metodosPagoRoutes';
import estadisticasRoutes from './routes/estadisticasRoutes';
import uploadsRoutes from './routes/uploadsRoutes';
import perfilRoutes from './routes/perfilRoutes';
import { carpetaUploads } from './config/uploads';
import { sincronizarLogos } from './utils/sincronizarLogos';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(carpetaUploads));

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
    sincronizarLogos()
        .then(total => total > 0 && console.log(`Logos enlazados automáticamente: ${total}`))
        .catch(error => console.error('No se pudieron enlazar los logos:', error.message));
});