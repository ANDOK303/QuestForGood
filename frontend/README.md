#  QuestForGood

**Juega. Ahorra. Ayuda.**

QuestForGood es una tienda web de videojuegos con impacto social: cada compra aplica un descuento al juego y destina el **5 %** del monto pagado a una causa social que elige el propio usuario (reforestación, agua potable, educación, etc.). Incluye un dashboard público con el impacto acumulado, perfil de usuario con cupones y un panel de administración.

##  Características

- Catálogo de juegos con descuento, categorías y logos.
- Compra con selección de **causa** a apoyar y **método de pago** (simulado).
- Registro e inicio de sesión con JWT (sesión de 2 horas).
- **Cupón de regalo diario** al iniciar sesión.
- Perfil: foto, nombre, juegos de interés, cupones y compras recientes.
- Historial de compras y total donado.
- Dashboard de impacto con gráficas (donado por causa, por mes y juegos más comprados).
- Panel de administración (CRUD de juegos y causas, subida de logos).

##  Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 22 (standalone components, signals), Chart.js |
| Backend | Node.js, Express 5, TypeScript, JWT, bcryptjs, multer |
| Base de datos | MySQL (mysql2) |
##  Estructura
```
QuestForGood/
├── backend/     API REST (Express + TypeScript)
├── frontend/    Aplicación Angular
└── DB/          Scripts SQL (esquema, datos y tablas adicionales)
```

##  Requisitos

- Node.js 20 o superior y npm
- MySQL 8 o superior
##  Instalación rápida

### 1. Base de datos

Ejecuta los scripts de la carpeta `DB/` **en este orden**:

1. `Base de datos` → crea la BD `questforgood_in5bv`, tablas, roles, categorías y métodos de pago.
2. `inserts` → causas y juegos iniciales.
3. `tablas adicionaleseinserts` → foto de perfil, intereses, cupones, más datos de prueba y el usuario administrador.

### 2. Backend

```bash
cd backend
npm install
```

Crea (o edita) el archivo `backend/.env`:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=questforgood_in5bv
DB_PORT=3306
PORT=3000
JWT_SECRET=una_clave_larga_y_secreta
```

Inicia el servidor:

```bash
npm run dev
```

La API queda en `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Abre `http://localhost:4200`.

> Si cambias el puerto o la URL del backend, actualiza `BASE_URL` en `frontend/src/app/config.ts`.

##  Usuarios de prueba

Todos los usuarios de prueba comparten la misma contraseña hash incluida en los scripts. Consulta con tu equipo la contraseña en texto plano o genera una nueva con bcrypt.

| Rol | Correo |
|-----|--------|
| Administrador | `admin@questforgood.com` |
| Moderador | `luis@test.com` |
| Cliente | `ana@test.com`, `carlos@test.com`, `sofia@test.com`, … |

##  Endpoints principales

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/usuarios/registro` · `/api/usuarios/login` | Público |
| GET | `/api/juegos` · `/api/juegos/:id` · `/api/juegos/categorias` | Público |
| GET | `/api/causas` · `/api/causas/:id` | Público |
| GET | `/api/metodos-pago` · `/api/estadisticas` | Público |
| POST | `/api/compras` | Usuario autenticado |
| GET | `/api/compras/usuario/:id` | Dueño o admin |
| GET/PUT | `/api/perfil` | Usuario autenticado |
| POST/DELETE | `/api/perfil/foto` · `/api/perfil/intereses` | Usuario autenticado |
| POST/PUT/DELETE | `/api/juegos` · `/api/causas` | Solo admin |
| POST | `/api/uploads/juegos?nombre=...` | Solo admin |

## Más documentación

Consulta la **Documentación técnica** y el **Manual de usuario** para el detalle de arquitectura, modelo de datos, reglas de negocio y guía de uso.

##  Notas
- Los pagos son **simulados**: no se procesa dinero real.
- No subas el archivo `.env` a repositorios públicos.