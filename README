# Plannix - Sistema de gestión de tareas


Plannix es una plataforma integral de gestión de tareas diseñada para mejorar la productividad. El sistema permite gestionar tareas, prioridades, estados y fechas límite, integrándose tanto con una interfaz web moderna como con un asistente de Telegram para el control remoto.


**Stack:** Node.js (Express) · React  · Prisma ORM · MySQL · Telegraf (Telegram Bot API, Telegraf) · Autenticación JWT

## Requisitos
- Node.js 18+ instalado
- MySQL o una base de datos compatible accesible
- Token de Telegram creado con `@BotFather` para activar la integración opcional
- Archivo `plannix-back-end/.env` configurado (puedes copiar `plannix-back-end/.env.example`)

## Portfolio

Proyecto desarrollado para demostrar capacidades full-stack: gestión de estados, autenticación segura, integración con servicios externos (Telegram) y despliegue.



| | |
|---|---|
| **Repositorio** | [github.com/Mariia-st/Plannix.git](https://github.com/Mariia-st/Plannix.git) |
| **Contacto** | maskastarik@gmail.com |


### Capturas de pantalla


![Inicio de sesión](docs/screenshots/inicio-session.png)
![Panel inicio de tareas](docs/screenshots/inicio-tareas.png)
![Pop up de tarea ](docs/screenshots/pop-up-tarea.png)
![Perfil de usuario ](docs/screenshots/perfil-user.png)
![Telegram bot ](docs/screenshots/telegram-bot.jpg)



### Qué demuestra este proyecto

- API REST robusta con Node.js, Express y Prisma ORM para gestión de base de datos.
- Interfaz SPA intuitiva utilizando React/Angular, con gestión de estado y diseño responsive.
- Integración con Telegraf mediante una máquina de estados (WizardScene) para interacción fluida.

---


## Características

### Gestión de Tareas
- Creación, edición y eliminación (CRUD) completa.
- Sistema de prioridades (Baja, Media, Alta, Urgente).
- Estados de flujo: Pendiente, En curso, Completada.

### Telegram Bot (PlannixBot)
- Vinculación de cuenta mediante códigos únicos.
- Gestión interactiva: Listado, creación y borrado de tareas desde el chat.
- Flujo guiado: Título → Descripción → Estado → Prioridad → Fecha/Hora.


### General
- Autenticación segura.
- Gestión de perfil de usuario (Avatar, nombre, contraseña).
- Diseño moderno adaptado a móviles.



## Instalación rápida

### 1. Backend
Crea el archivo `plannix-back-end/.env` copiando el ejemplo:

```bash
cd plannix-back-end
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

#### Variables de entorno
En `plannix-back-end/.env` define estas variables:

```env
DATABASE_URL="mysql://usuario:contraseña@host:puerto/base_de_datos"
TELEGRAM_BOT_TOKEN="tu_token_de_telegram"
SECRET_KEY="tu_clave_secreta"
PORT=8080
```

- `TELEGRAM_BOT_TOKEN` debe ser tu token personal de `@BotFather`.
- Si no usas el bot de Telegram, deja `TELEGRAM_BOT_TOKEN` vacío: la app web y la API seguirán funcionando, pero la parte de bot no estará disponible.
- El backend se ejecuta por defecto en `http://localhost:8080`.

### 2. Front
```bash
cd plannix-front-end
npm install
npm run dev
```
- El frontend se ejecuta por defecto en `http://localhost:5173`

---

## Estructura del proyecto

```
Plannix/
├── plannix-back-end/                  # API Node.js + Prisma
│   ├── src/
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── bot_telegram/     # Lógica del bot (Telegraf)
│   │   └── routes/           # Rutas API
├── plannix-front-end/                 # App React + Vite
│   └── src/
│       └── components/
│           └── Pages/    # Componentes de UI
```

### Carpetas del frontend (`Pages/`)

| Carpeta | Descripción |
|---------|-------------|
| `Login/` | Pantalla de inicio de sesión |
| `Home/` | Panel principal de tareas y gestión de tareas |
| `User/` | Perfil de usuario y cambio de contraseña |
| `Layout/` | Diseño global: header, navegación y estructura |

### Carpetas del frontend (`Task/`)

| Carpeta | Descripción |
|---------|-------------|
| `Task/` | Componentes para lista, formulario y detalle de tareas |

---

## Rutas del frontend

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `Login` | Login / registro |
| `/inicio` | `Home` | Panel de tareas protegido; aquí se gestiona la lista, creación y edición de tareas |
| `/perfil` | `User` | Perfil y cambio de contraseña |

---



## API principal

### Públicas
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Crear cuenta de usuario |
| POST | `/auth/login` | Iniciar sesión |

### Autenticadas (`Authorization: Bearer <token>`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/auth/me` | Obtener datos del usuario autenticado |
| GET | `/tasks` | Listar tareas del usuario |
| POST | `/tasks` | Crear nueva tarea |
| GET | `/tasks/:id` | Obtener una tarea por id |
| PUT | `/tasks/:id` | Actualizar tarea |
| DELETE | `/tasks/:id` | Eliminar tarea |
| PUT | `/user` | Actualizar datos del usuario |
| PUT | `/user/avatar` | Subir o cambiar avatar |
| PUT | `/user/password` | Cambiar contraseña |
| GET | `/user/code` | Generar código para vincular Telegram |

---

## Autenticación

1. El usuario inicia sesión con `/auth/login` o se registra en `/auth/register`.
2. El backend devuelve un token JWT.
3. El frontend envía el token en `Authorization: Bearer <token>` para las rutas protegidas.
4. Las rutas de tareas y usuario requieren autenticación.

---

## Uso de Telegram

Para usar la funcionalidad del bot de Telegram, el usuario debe:
- crear su propio bot con `@BotFather`,
- copiar el token en `plannix-back-end/.env` como `TELEGRAM_BOT_TOKEN`,
- obtener un código desde la app con `/user/code` para vincular su cuenta.

Si no se configura `TELEGRAM_BOT_TOKEN`, la app web funciona igual, pero el bot de Telegram no estará disponible.

---

## Comandos útiles

```bash
# Backend
cd plannix-back-end
npm install
npx prisma migrate dev
npm run dev

# Frontend
cd plannix-front-end
npm install
npm run dev
```

---

## Contacto

maskastarik@gmail.com

---

© 2026 Plannix — Sistema de gestión de tareas con integración de Telegram