# Branex x Go to Marketing Dashboard

Plataforma multi-tenant de dashboards empresariales construida con Next.js 14, TypeScript y Supabase.

## Requisitos

- Node.js 20+ (en este entorno se instaló la versión **portátil** en `%USERPROFILE%\.local\node-v20.18.1-win-x64`; añade esa carpeta al `PATH` del sistema o usa la ruta completa a `node.exe` y `npm.cmd`)
- Cuenta de Supabase

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores.

## Scripts

- `npm run dev`: servidor local
- `npm run build`: build de producción
- `npm run start`: ejecutar build
- `npm run lint`: lint del proyecto
- `npm run typecheck`: validación de tipos TypeScript

## Seguridad aplicada (Fase 1)

- JWT obligatorio en todas las API Routes
- RLS habilitado en todas las tablas de negocio
- Doble filtro anti-IDOR (`RLS + eq(company_id, ...)`)
- Headers de seguridad en `next.config.mjs`
