# StickerLog

Control digital de álbumes de figuritas.  
Crea álbumes, registra figuritas, marca hologramas, ve faltantes y repetidas, comparte tu lista y exporta CSV/JSON. Optimizado para celular y simple para que lo use un niño.

**Demo:** https://2pac2papi.github.io/stickerlog/

---

## ✨ Funcionalidades

- Múltiples álbumes (renombrar y eliminar)
- Grid táctil para sumar/restar y editar cantidades
- Marcar **Holo** por figurita (visual con 🌟)
- **Agregar rápido** por rangos: `1-50, 55, 80-90`
- Resumen: Únicas, Faltantes, Repetidas + barra de progreso
- Compartir faltantes y repetidas (WhatsApp / copiar)
  - Repetidas muestran **excedentes** (si tienes 4 → `x3`)
- Exportar **CSV** y **JSON**
- Persistencia en **localStorage** (sin backend)

---

## 📸 Captura de pantalla

> Agrega aquí una imagen del app (opcional).  
> Ejemplo: `docs/screenshot.png`

![StickerLog screenshot](docs/screenshot.png)

---

## 🛠️ Tecnologías

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- Tailwind (clases utilitarias en el marcado)
- GitHub Pages (deploy automático con Actions)

---

## 📦 Requisitos

- Node.js 18+ (recomendado 20)
- npm

---

## ▶️ Uso local

```bash
# Instalar dependencias
npm install

# Levantar en modo desarrollo
npm run dev

# Abrir la URL que te muestra Vite (ej: http://localhost:5173)
```

---

## 🏗️ Build de producción

```bash
npm run build
# Archivos generados en /dist
```

Previsualizar el build localmente:

```bash
npm run preview
```

---

## 🚀 Deploy a GitHub Pages

Ya está configurado para publicarse automáticamente con cada **push a `main`**.

- `vite.config.js` incluye:
  ```js
  export default defineConfig({
    base: '/stickerlog/', // nombre del repositorio
  })
  ```
- `404.html` en la raíz redirige rutas al `index.html` (Single Page App).
- Workflow: `.github/workflows/deploy.yml` (construye y publica `dist/`).

**URL de producción:**  
https://2pac2papi.github.io/stickerlog/

---

## 🗂️ Estructura del proyecto

```
.
├─ index.html
├─ 404.html
├─ vite.config.js
├─ package.json
├─ src/
│  ├─ App.jsx
│  └─ main.jsx
└─ .github/workflows/deploy.yml
```

---

## 📤 Importar / Exportar

- **Exportar CSV**: lista de figuritas presentes (`numero`, `cantidad`, `holo`).
- **Exportar JSON**: respaldo completo (todos los álbumes).
- **Importar JSON**: desde la app, selecciona el archivo exportado previamente.

---

## 🧩 Atajos / Consejos

- **Sumar** 1 a una figurita: tocar el botón del cuadro.
- **Editar** cantidad: usa el input numérico del cuadro.
- **Holo**: marca la casilla “Holo” del cuadro (verás 🌟).
- **Agregar rápido**: escribe rangos/valores `1-50, 55, 80-90` y presiona “Sumar +1 a cada uno”.

---

## 🐞 Problemas comunes

- **Pantalla en blanco en Pages**  
  - Verifica `base: '/stickerlog/'` en `vite.config.js`.  
  - Ctrl+F5 para recargar sin caché.  
  - Asegúrate de tener `404.html` en la raíz.
- **Deploy falla en Actions**  
  - Revisa el log en la pestaña *Actions*.  
  - Confirma que `package.json` tenga el script `"build": "vite build"`.

---

## 🙌 Contribuir

Sugerencias y PRs son bienvenidos.  
Para cambios grandes, abre primero un Issue para discutir la propuesta.

---

## 📄 Licencia

MIT © 2pac2papi
