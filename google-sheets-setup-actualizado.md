# Configuración de Google Sheets API - Usando API Key

## 🎯 Configuración Simple con API Key

Has elegido la opción más directa y fácil de implementar. Vamos a configurar tu proyecto para usar API Key.

## 📋 Resumen de lo que vamos a hacer:

1. **Crear una API Key** en Google Cloud Console
2. **Crear tu Google Sheet** con la estructura correcta
3. **Configurar permisos** de la hoja (pública o compartida)
4. **Actualizar config.js** con los valores correctos
5. **Probar la funcionalidad**

## 🔧 Paso a paso:

### Paso 1: Obtener API Key adicional
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto "sabores-del-bosque-api"
3. Ve a "APIs & Services" > "Credentials"
4. Clic en "Create Credentials" > "API key"
5. Copia la API key generada

### Paso 2: Configurar Google Sheets
1. Crea tu hoja de Google Sheets con la estructura correcta:

```
| ID | Producto | Categoría | Stock_actual | Stock_mínimo | Precio_unitario_CLP | Fecha_último_ingreso | Fecha_última_salida |
|----|----------|-----------|--------------|--------------|-------------------|-------------------|-------------------|
| 1  | Castañas en almíbar | Conservas | 25 | 8 | 3957 | 2025-07-18 | 2025-07-18 |
```

2. Compartir la hoja:
   - **Método A (Público):** Compartir con "Cualquier persona con el enlace" con permisos de "Editor"
   - **Método B (Privado):** Compartir específicamente con `frutos@sabores-del-bosque-api.iam.gserviceaccount.com`

### Paso 3: Configurar config.js ✅ COMPLETADO
```javascript
const CONFIG = {
    GOOGLE_SHEETS: {
        SHEET_ID: '1-drjJ5lnn5aEfriQOij0fE8IpuMrxTzTRBo_TkYhqh8', // ✅ Configurado
        API_KEY: 'AIzaSyDwXvciqYssGgfqnUzvWbTXjekj4ePRcAg', // ✅ Configurado
        SHEET_NAME: 'Hoja 1' // Verifica que coincida con el nombre de tu hoja
    },
    // ... resto de la configuración
};
```

## ✅ Progreso actual:
- ✅ **API Key:** Configurada
- ✅ **SHEET_ID:** Configurado
- ⏳ **Google Sheet:** ¿Ya configuraste la estructura y permisos?

## 🚀 Siguiente paso: Verificar tu Google Sheet

**Importante:** Asegúrate de que tu Google Sheet tenga:

1. **Headers exactos en la fila 1:**
```
A1: ID
B1: Producto  
C1: Categoría
D1: Stock_actual
E1: Stock_mínimo
F1: Precio_unitario_CLP
G1: Fecha_último_ingreso
H1: Fecha_última_salida
```

2. **Permisos públicos:**
   - Botón "Compartir" → "Cualquier persona con el enlace" → "Editor"

3. **Datos de ejemplo (fila 2):**
```
A2: 1
B2: Castañas en almíbar
C2: Conservas
D2: 25
E2: 8
F2: 3957
G2: 2025-07-18
H2: 2025-07-18
```

## 📋 ¿Qué haremos con la cuenta de servicio?

**Para este proyecto:** No la usaremos directamente, pero es muy valiosa para futuros proyectos.

**Recomendación:** Guarda el archivo `sabores-del-bosque-api-53b6fd2e44ff.json` en un lugar seguro fuera del proyecto (como tu carpeta de Documentos) para usarla en proyectos backend futuros.

## 🎯 ¿Listo para empezar?

Ahora vamos a configurar la opción API Key paso a paso.
