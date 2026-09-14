# React + Vite

## Backend con MySQL

1. Importa `database/schema.sql` en phpMyAdmin o con el cliente MySQL.
2. Copia `server/.env.example` como `server/.env` y configura las credenciales.
3. Instala con `npm install` y `npm --prefix server install`.
4. Inicia cliente y API con `npm run dev`.

También puedes crearla desde PHP con `DB_USER=root DB_PASSWORD=tu_clave php database/setup.php`.
Ese comando requiere la extensión `pdo_mysql` habilitada.

La API queda disponible en `http://localhost:4001`. El catálogo se carga desde `GET /api/products` y el checkout persiste pedidos en `orders` y `order_items`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
