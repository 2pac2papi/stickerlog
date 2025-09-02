# StickerLog — Control de Álbumes de Figuritas

**URL pública:** https://2pac2papi.github.io/stickerlog-app/

StickerLog es una app web para llevar el control de tus figuritas (álbumes, repetidas y faltantes).  
Funciona en **celular y PC**, no necesita cuentas ni backend (guarda en *localStorage*).

> Desde la versión 3.6 ya **no** se usa la opción *Holograma*.

---

## 🚀 Funcionalidades
- Varios álbumes (crear, renombrar y eliminar)
- Definir el **total** de figuritas por álbum
- **Grid táctil**: sumar +1 con un toque o editar cantidad
- Agregar rápido por rangos: `1-50, 55, 80-90`
- Resumen con **progreso**, **faltantes** y **repetidas (excedentes)**
- Compartir lista por **WhatsApp** o copiar texto
- Exportar **CSV** y **JSON**, e **importar JSON** de respaldo
- Persistencia automática en el navegador

---

## 🛠️ Instalación local

Requisitos:
- Node.js 18+ (recomendado 20)
- npm

Pasos:
```bash
git clone https://github.com/2pac2papi/stickerlog-app.git
cd stickerlog-app
npm install
npm run dev
```

Abre http://localhost:5173

---

## 🌍 Deploy en GitHub Pages

Este repo publica automáticamente con **GitHub Actions**.  
Cada `git push` a `main` despliega a:

- **https://2pac2papi.github.io/stickerlog-app/**

### Configuración Vite
Asegúrate de que `vite.config.js` tenga el `base` correcto:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/stickerlog-app/', // nombre del repositorio en GitHub
})
```

### Cache-buster
`index.html` y `404.html` incluyen un pequeño script que añade `?v=3.7.0` a la URL para forzar la actualización del `index` en el CDN de Pages.  
En cada release, **actualiza el número** para garantizar que todos vean la versión nueva.

---

## 📂 Estructura
```
stickerlog-app/
 ├─ src/
 │   ├─ App.jsx
 │   ├─ main.jsx
 │   └─ index.css
 ├─ public/
 │   └─ favicon.ico
 ├─ index.html
 ├─ 404.html
 ├─ package.json
 ├─ vite.config.js
 └─ .github/workflows/deploy.yml
```

---

## ✨ Autor
- @2pac2papi
- Versión actual: **3.7.0**
