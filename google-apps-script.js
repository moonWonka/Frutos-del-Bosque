/**
 * @file Google Apps Script para la API de Inventario de Sabores del Bosque.
 * @summary Permite la operación de lectura (getInventory) y una respuesta simple a peticiones POST.
 * Incluye manejo robusto de CORS (Cross-Origin Resource Sharing) para peticiones desde el frontend.
 *
 * ESTA ES LA VERSIÓN FINAL CON getInventory (GET) Y UNA RESPUESTA SIMPLE para POST.
 * La cabecera Content-Type para las respuestas JSON ahora es 'application/json'.
 *
 * CORRECCIÓN: Se ha modificado createJsonResponse para usar ContentService.MimeType.JSON.
 * Se ha corregido el TypeError: output.addHeader is not a function en doOptions.
 *
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 1. Copia y pega este código completo en script.google.com.
 * 2. ACTUALIZA las constantes SPREADSHEET_ID y SHEET_NAME con tus valores reales.
 * 3. Despliega como Web App:
 * - Ejecutar como: "Yo" (tu cuenta de Google).
 * - Quién tiene acceso: "Cualquier persona".
 * 4. Copia la URL de la Web App generada y úsala en tu frontend.
 * 5. Cada vez que hagas un cambio en este código, DEBES desplegar una "Nueva versión" de la Web App.
 */

// ========== CONFIGURACIÓN ==========
// ¡IMPORTANTE! Reemplaza 'TU_SHEET_ID_AQUI' con el ID real de tu hoja de cálculo de Google Sheets.
// El ID se encuentra en la URL de tu hoja, entre '/d/' y '/edit/'.
const SPREADSHEET_ID = '1-drjJ5lnn5aEfriQOij0fE8IpuMrxTzTRBo_TkYhqh8'; // Ejemplo: '1-drjJ5lnn5aEfriQOij0fE8IpuMrxTzTRBo_TkYhqh8'

// ¡IMPORTANTE! Reemplaza 'Inventario' con el nombre EXACTO de la pestaña (hoja) dentro de tu documento de Google Sheets.
const SHEET_NAME = 'Inventario'; // Ejemplo: 'Inventario' o 'Hoja1'

/**
 * Función principal que maneja las solicitudes GET a la Web App.
 * Usada para obtener el inventario.
 * @param {GoogleAppsScript.Events.DoGet} e - Objeto de evento con los parámetros de la solicitud GET.
 * @returns {GoogleAppsScript.Content.TextOutput} Una respuesta JSON.
 */
function doGet(e) {
  try {
    console.log('Recibida petición GET:', e.parameter);
    
    const action = e.parameter.action; // Obtiene la acción de los parámetros de la URL (ej. ?action=getInventory)

    if (action === 'getInventory') {
      return getInventoryAction();
    }

    // Si no es 'getInventory' o no se especifica una acción, informa al usuario.
    return createJsonResponse(false, 'Acción no válida para GET. Use GET con ?action=getInventory para obtener el inventario.', null);
  } catch (error) {
    // Captura cualquier error durante el procesamiento de la solicitud GET.
    console.error('Error en doGet:', error.message, error.stack);
    return createJsonResponse(false, 'Error interno del servidor al procesar la solicitud GET: ' + error.message, null);
  }
}

/**
 * Función doPost para manejar peticiones POST.
 * Devuelve un estado 200 OK simple, como se solicitó.
 * @param {GoogleAppsScript.Events.DoPost} e - Objeto de evento con los datos de la solicitud POST.
 * @returns {GoogleAppsScript.Content.TextOutput} Una respuesta JSON de éxito simple.
 */
function doPost(e) {
  Logger.log("doPost called");
  // Devuelve una respuesta JSON de éxito simple con status 200, como en el ejemplo proporcionado.
  // Se usa createJsonResponse para asegurar el manejo correcto de CORS.
  return createJsonResponse(true, 'Petición POST recibida y procesada.', { status: 200 });
}


/**
 * Obtiene todos los productos del inventario de la hoja de cálculo.
 * @returns {GoogleAppsScript.Content.TextOutput} Respuesta JSON con el inventario.
 */
function getInventoryAction() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return createJsonResponse(false, `La hoja con el nombre '${SHEET_NAME}' no fue encontrada.`, null);
    }
    const values = sheet.getDataRange().getValues();

    if (values.length <= 1) { // Si solo hay encabezados o está vacía
      return createJsonResponse(true, 'Inventario vacío.', []);
    }

    const headers = values[0]; // La primera fila son los encabezados de las columnas
    const inventory = [];

    // Itera sobre las filas de datos (desde la segunda fila en adelante)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const product = {};

      // Mapea los valores de la fila a un objeto usando los encabezados como claves
      headers.forEach((header, index) => {
        product[header] = row[index];
      });

      inventory.push(product);
    }

    return createJsonResponse(true, 'Inventario obtenido correctamente.', inventory);

  } catch (error) {
    console.error('Error en getInventoryAction:', error.message, error.stack);
    return createJsonResponse(false, 'Error al obtener inventario: ' + error.message, null);
  }
}

/**
 * Crea una respuesta estándar en formato JSON para todas las operaciones de la API.
 * Utiliza ContentService.createTextOutput() y setMimeType() para el Content-Type.
 * @param {boolean} success - Indica si la operación fue exitosa.
 * @param {string} message - Mensaje descriptivo del resultado de la operación.
 * @param {any} data - Datos adicionales a incluir en la respuesta (objeto o array).
 * @returns {GoogleAppsScript.Content.TextOutput} El objeto TextOutput configurado.
 */
function createJsonResponse(success, message, data) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };

  // Crea el objeto TextOutput con el JSON serializado.
  const output = ContentService.createTextOutput(JSON.stringify(response));

  // Establece el tipo MIME de la respuesta a application/json.
  output.setMimeType(ContentService.MimeType.JSON); // Establece Content-Type: application/json; charset=utf-8

  // Nota: Con ContentService.createTextOutput(), no se pueden añadir cabeceras HTTP personalizadas
  // usando addHeader(). Solo se puede establecer el Content-Type con setMimeType().

  return output;
}

/**
 * Maneja las peticiones OPTIONS (preflight requests) para CORS.
 * Esta función es CRÍTICA para permitir que las solicitudes POST/PUT/DELETE
 * con Content-Type: application/json (o cualquier Content-Type no simple)
 * funcionen desde un dominio diferente (CORS).
 * @returns {GoogleAppsScript.Content.HtmlOutput} Una respuesta vacía con las cabeceras CORS necesarias.
 */
function doOptions() {
  const response = HtmlService.createHtmlOutput("");
  response.addHeader('Access-Control-Allow-Origin', '*');
  response.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Ahora incluye POST
  response.addHeader('Access-Control-Allow-Headers', 'Content-Type'); // Se asegura que Content-Type esté permitido
  response.addHeader('Access-Control-Max-Age', '86400'); 
  
  return response;
}
