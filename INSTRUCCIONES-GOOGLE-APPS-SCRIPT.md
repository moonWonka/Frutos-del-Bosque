# Configuración de Google Apps Script para Sabores del Bosque

## Paso 1: Crear el Google Apps Script

1. Ve a **script.google.com**
2. Haz clic en **"Nuevo proyecto"**
3. Borra el código por defecto
4. Copia y pega el contenido del archivo `google-apps-script.js`
5. Cambia el nombre del proyecto a "Sabores del Bosque API"

## Paso 2: Configurar Variables

En el script, asegúrate de que estas variables estén correctas:

```javascript
const SHEET_ID = '1-drjJ5lnn5aEfriQOij0fE8IpuMrxTzTRBo_TkYhqh8'; // Tu ID actual
const SHEET_NAME = 'Inventario'; // Nombre de tu hoja
```

## Paso 3: Dar Permisos

1. Haz clic en **"Ejecutar"** (ícono ▶️)
2. Google te pedirá permisos
3. Haz clic en **"Revisar permisos"**
4. Selecciona tu cuenta de Google
5. Haz clic en **"Ir a [nombre del proyecto] (no seguro)"**
6. Haz clic en **"Permitir"**

## Paso 4: Desplegar como Web App

1. Haz clic en **"Implementar"** > **"Nueva implementación"**
2. Selecciona el tipo: **"Aplicación web"**
3. Configuración:
   - **Ejecutar como:** "Yo"
   - **Quién puede acceder:** "Cualquier persona"
4. Haz clic en **"Implementar"**
5. **¡IMPORTANTE!** Copia la URL que aparece (algo como: `https://script.google.com/macros/s/AKfycby...`)

## Paso 5: Probar la API

Puedes probar si funciona visitando esta URL en tu navegador:
```
[TU_URL_DE_WEB_APP]?action=getInventory
```

Deberías ver tu inventario en formato JSON.

## Funciones Disponibles en la API

### 1. Obtener Inventario (GET)
```
GET [URL]?action=getInventory
```

### 2. Actualizar Stock (POST)
```javascript
// Restar stock (venta)
{
  "action": "updateStock",
  "productId": 1,
  "operation": "subtract",
  "quantity": 2
}

// Agregar stock (reposición)
{
  "action": "updateStock",
  "productId": 1,
  "operation": "add",
  "quantity": 10
}

// Establecer stock específico
{
  "action": "updateStock",
  "productId": 1,
  "newStock": 25
}
```

### 3. Agregar Producto (POST)
```javascript
{
  "action": "addProduct",
  "producto": "Nuevo Producto",
  "categoria": "Categoría",
  "stock_actual": 20,
  "stock_minimo": 5,
  "precio_unitario_clp": 2500
}
```

### 4. Eliminar Producto (POST)
```javascript
{
  "action": "deleteProduct",
  "productId": 1
}
```

## Ejemplo de Respuesta

Todas las funciones devuelven JSON en este formato:

```json
{
  "success": true,
  "message": "Stock actualizado correctamente",
  "data": {
    "productId": 1,
    "previousStock": 25,
    "newStock": 23,
    "operation": "subtract",
    "quantity": 2,
    "date": "2025-07-18"
  },
  "timestamp": "2025-07-18T15:30:00.000Z"
}
```

## Ventajas de esta Solución

✅ **Seguridad:** Las credenciales están en Google, no en tu código
✅ **Gratuito:** Google Apps Script es gratuito
✅ **Fácil:** No necesitas servidor propio
✅ **Automático:** Se actualiza automáticamente
✅ **CORS:** Configurado para funcionar desde cualquier dominio

## Próximo Paso

Una vez que tengas la URL del Web App, actualiza tu `config.js` con esta nueva URL para que tu frontend pueda comunicarse con el Google Apps Script.
