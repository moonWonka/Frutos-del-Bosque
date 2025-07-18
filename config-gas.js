// ================================
// CONFIGURACIÓN PARA GOOGLE APPS SCRIPT
// ================================

const APPS_SCRIPT_CONFIG = {
    // ✅ URL configurada del Google Apps Script Web App
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxAn3vLmI-YSo7RqI07OTMK1fjpYfBMLx9eA_8_soVOmI_WBMrWUy-q1SwiquErLr-s/exec',
    
    // Configuración adicional
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3
};

// ================================
// UTILIDADES DE CONFIGURACIÓN
// ================================
const ConfigUtils = {
    /**
     * Verificar si Google Apps Script está configurado
     */
    isGoogleAppsScriptConfigured() {
        return APPS_SCRIPT_CONFIG.WEB_APP_URL !== 'REEMPLAZAR_CON_TU_URL_DE_WEB_APP';
    },

    /**
     * Obtener mensaje de configuración
     */
    getConfigMessage() {
        if (!this.isGoogleAppsScriptConfigured()) {
            return '⚠️ CONFIGURACIÓN PENDIENTE: Necesitas configurar la URL del Google Apps Script';
        }
        return '✅ Google Apps Script configurado correctamente';
    },

    /**
     * Mostrar estado de configuración
     */
    showConfigStatus() {
        console.log('📋 Estado de configuración:');
        console.log(this.getConfigMessage());
        
        if (this.isGoogleAppsScriptConfigured()) {
            console.log('🔗 URL configurada:', APPS_SCRIPT_CONFIG.WEB_APP_URL);
            console.log('🚀 Sistema listo para usar');
        }
    }
};

// Mostrar estado al cargar
document.addEventListener('DOMContentLoaded', () => {
    ConfigUtils.showConfigStatus();
});
