# StickerLog — Control de Álbumes de Figuritas

StickerLog es una aplicación web simple para llevar el control de tus figuritas y álbumes (Dragon Ball, Pokémon, Mundial, etc.).  
Funciona en **celular o PC** y está pensada para ser tan sencilla que incluso un niño de 8 años pueda usarla.

👉 Demo en línea: [StickerLog en GitHub Pages](https://2pac2papi.github.io/stickerlog/)

---

## 🚀 Funcionalidades

- Crear múltiples álbumes (ej. Dragon Ball, Qatar 2022, etc.)
- Definir el **total de figuritas** por álbum
- Ver progreso con barra y porcentaje
- **Grid visual** para marcar cuáles tienes y cuántas veces
- Botón rápido “+1” o edición manual de cantidades
- Agregar múltiples figuritas a la vez (`1-50, 55, 80-90`)
- Ver faltantes (lista expandible)
- Detecta repetidas (cuenta solo las que sobran)
- Exportar/Importar:
  - **CSV** para abrir en Excel o Google Sheets
  - **JSON** como respaldo completo
- Compartir lista (faltantes y repetidas) por **WhatsApp** o copiar al portapapeles
- Renombrar o eliminar álbumes
- Persistencia automática en el navegador (usa `localStorage`)

> ⚠️ **Nota:** la versión 3.6 elimina todo lo relacionado a *hologramas*.  
> Ahora solo manejamos figuritas normales y repetidas.

---

## 🖼️ Captura

![StickerLog captura](docs/screenshot.png)

---

## 🔧 Instalación local

Requisitos:
- [Node.js](https://nodejs.org/) 18+
- npm (incluido con Node)

Pasos:
```bash
# 1. Clonar el repositorio
git clone https://github.com/2pac2papi/stickerlog.git
cd stickerlog

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

Abre en tu navegador: [http://localhost:5173](http://localhost:5173)

---

## 🌍 Deploy en GitHub Pages

1. El proyecto ya incluye configuración con **Vite + GitHub Actions**
2. Cada vez que hagas `git push` a `main`, se publica en:  
   👉 https://2pac2papi.github.io/stickerlog/

---

## 📂 Estructura del proyecto

```
stickerlog/
 ├─ src/
 │   ├─ App.jsx        # Lógica principal de la app
 │   ├─ main.jsx       # Punto de entrada
 │   └─ index.css      # Estilos
 ├─ public/
 │   └─ favicon.ico
 ├─ package.json
 ├─ vite.config.js
 └─ .github/workflows/deploy.yml   # Automatización de GitHub Pages
```

---

## ✨ Autor

Creado por **Antonio Ricardo Conte** (@2pac2papi)  
Versión actual: **3.6 (sin hologramas)**
