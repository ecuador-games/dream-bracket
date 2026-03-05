# DreamBracket 🏆

Plataforma para gestionar torneos competitivos de Dream League Soccer con sistema de llaves de 16 equipos estilo Champions League.

## Características

- 🔐 Autenticación con Supabase (Email/Password y Google OAuth)
- 👥 Sistema de roles (Admin, Organizer, Player)
- 🏆 Creación y gestión de torneos
- ⚽ Gestión de equipos personalizados
- 🎲 Sorteo automático con algoritmo Fisher-Yates
- 📊 Visualización de brackets estilo Champions League
- 📸 Exportación de brackets como imagen PNG
- 🔒 Row Level Security (RLS) en Supabase

## Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Validación**: Zod + React Hook Form
- **Exportación**: html-to-image

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/dream-bracket.git
cd dream-bracket
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

4. Configura la base de datos en Supabase:
   - Ve a tu proyecto en Supabase
   - Abre el SQL Editor
   - Copia y ejecuta el contenido de `supabase/schema.sql`

5. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Estructura del Proyecto

```
dream-bracket/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── dashboard/         # Dashboard y torneos
│   │   └── page.tsx           # Página principal
│   ├── components/
│   │   ├── bracket/           # Componentes del bracket
│   │   └── ui/                # Componentes de shadcn/ui
│   ├── lib/
│   │   ├── supabase/          # Clientes de Supabase
│   │   ├── bracket.ts         # Lógica de generación de brackets
│   │   └── utils.ts           # Utilidades (Fisher-Yates, etc.)
│   └── types/
│       └── database.ts        # Tipos de TypeScript para Supabase
├── supabase/
│   └── schema.sql             # Schema de la base de datos
└── public/                    # Archivos estáticos
```

## Arquitectura de Base de Datos

### Tablas Principales

- **profiles**: Perfiles de usuario con roles
- **teams**: Equipos creados por usuarios
- **tournaments**: Torneos con configuración
- **tournament_participants**: Relación torneo-equipos (16 equipos)
- **matches**: Partidos del bracket con referencias

### Sistema de Roles

- **admin**: Acceso total al sistema
- **organizer**: Puede crear y gestionar torneos y equipos
- **player**: Solo lectura de torneos públicos

### Row Level Security (RLS)

Todas las tablas tienen políticas RLS configuradas para:
- Admins: Acceso completo
- Organizers: CRUD en sus propios recursos
- Players: Solo lectura de contenido público

## Uso

### Crear un Torneo

1. Regístrate o inicia sesión
2. Ve al Dashboard
3. Haz clic en "Crear Torneo"
4. Configura 16 equipos
5. Genera el bracket con sorteo automático
6. Actualiza resultados
7. Exporta como imagen

### Algoritmo de Sorteo

El sistema utiliza el algoritmo Fisher-Yates para mezclar aleatoriamente los 16 equipos y generar las llaves de octavos de final:

```typescript
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

## Middleware de Protección

El middleware de Next.js protege las rutas:
- `/dashboard/*`: Requiere autenticación
- `/admin/*`: Requiere rol de admin

## Scripts Disponibles

```bash
pnpm dev      # Servidor de desarrollo
pnpm build    # Build de producción
pnpm start    # Servidor de producción
pnpm lint     # Linter
```

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Autor

Ecuador Games - [@ecuador-games](https://github.com/ecuador-games)

## Soporte

Si tienes preguntas o problemas, abre un issue en GitHub.