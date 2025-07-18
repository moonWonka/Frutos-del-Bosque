# Sabores del Bosque Ltda.

Sitio web de productos artesanales gourmet con integración a Google Sheets para gestión de inventario.

## 🌟 Características

- **Sitio web estático** con diseño responsive
- **Integración con Google Sheets** para tracking de ventas
- **Sistema de inventario automatizado**
- **Interfaz moderna** con Tailwind CSS
- **Listo para GitHub Pages**

## 📂 Estructura del proyecto

```
Frutos del Bosque/
├── index.html              # Página principal
├── js/
│   └── main.js             # Lógica principal y manejo de Google Sheets
├── config.js               # Configuración del proyecto
├── setup-google-sheets.md  # Guía de configuración de Google Sheets
├── README.md               # Este archivo
└── .gitignore              # Archivos a ignorar en Git
```

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/frutos-del-bosque.git
cd frutos-del-bosque
```

### 2. Configurar Google Sheets

Sigue la guía detallada en `setup-google-sheets.md` para:
- Crear un proyecto en Google Cloud Console
- Habilitar la API de Google Sheets
- Configurar credenciales
- Conectar tu hoja de cálculo

### 3. Configurar el proyecto

1. Abre `config.js`
2. Reemplaza los valores de configuración:
   ```javascript
   const CONFIG = {
       GOOGLE_SHEETS: {
           SHEET_ID: 'tu-sheet-id-aqui',
           API_KEY: 'tu-api-key-aqui',
           SHEET_NAME: 'Inventario'
       }
   };
   ```

### 4. Probar localmente

1. Abre `index.html` en tu navegador
2. Haz clic en "Comprar" en cualquier producto
3. Verifica que se registre en tu Google Sheet

## 🌐 Despliegue en GitHub Pages

### Opción 1: Desde la interfaz web

1. Sube el código a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona "Deploy from a branch"
4. Elige la rama `main` y carpeta `/root`
5. Tu sitio estará disponible en: `https://tu-usuario.github.io/frutos-del-bosque`

### Opción 2: Desde la línea de comandos

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit"

# Conectar con GitHub
git remote add origin https://github.com/tu-usuario/frutos-del-bosque.git
git branch -M main
git push -u origin main

# Activar GitHub Pages desde la configuración del repositorio
```

## 🛠️ Tecnologías utilizadas

- **HTML5** - Estructura del sitio
- **CSS3** - Estilos (Tailwind CSS)
- **JavaScript** - Funcionalidad e integración con APIs
- **Google Sheets API** - Gestión de inventario
- **GitHub Pages** - Hosting gratuito

## 📊 Funcionalidades del inventario

- **Registro automático** de ventas en Google Sheets
- **Timestamp** de cada transacción
- **Información detallada** de productos vendidos
- **Notificaciones** de compra exitosa
- **Manejo de errores** para conexiones fallidas

## 🔧 Personalización

### Agregar nuevos productos

1. Edita `config.js` para agregar productos al array `PRODUCTS`
2. Actualiza `index.html` para mostrar los nuevos productos
3. Los botones de compra se vincularán automáticamente

### Cambiar diseño

- Modifica las clases de Tailwind CSS en `index.html`
- Personaliza colores, fuentes y espaciado
- El diseño es completamente responsive

### Modificar funcionalidad

- Edita `js/main.js` para cambiar el comportamiento
- Agrega validaciones, carritos de compra, etc.
- Integra con otros servicios (PayPal, Stripe, etc.)

## 🔐 Seguridad

⚠️ **Importante**: En producción, considera:
- Usar OAuth2 en lugar de API keys
- Implementar validación del lado del servidor
- Restringir el acceso a la API key
- Usar variables de entorno para credenciales

## 📝 Próximas mejoras

- [ ] Carrito de compras
- [ ] Sistema de usuarios
- [ ] Pasarela de pagos
- [ ] Panel de administración
- [ ] Reportes de ventas
- [ ] Notificaciones por email

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Sabores del Bosque Ltda.**
- Email: info@saboresdelbosque.cl
- Teléfono: +56 123 456 789
- Ubicación: Valdivia, Chile

---

*Desarrollado con ❤️ para promover los sabores auténticos del sur de Chile*