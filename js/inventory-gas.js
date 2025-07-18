class GoogleSheetsAPI {
    constructor(webAppUrl) {
        this.webAppUrl = webAppUrl;
    }

    /**
     * Hacer petición POST al Google Apps Script
     */
    async makeRequest(data) {
        try {
            console.log('🔄 Enviando petición POST:', data);
            console.log('🌐 URL destino:', this.webAppUrl);
            
            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain', // Petición simple, no requiere preflight
                },
                body: JSON.stringify(data),
                mode: 'cors',
                redirect: 'follow' // Importante para Google Apps Script
            });

            console.log('📡 Respuesta recibida - Status:', response.status);
            console.log('📡 Respuesta recibida - Headers:', response.headers);

            if (!response.ok) {
                console.error('❌ Error HTTP:', response.status, response.statusText);
                
                // Intentar leer el cuerpo de la respuesta de error
                let errorText = '';
                try {
                    errorText = await response.text();
                    console.error('❌ Cuerpo del error:', errorText);
                } catch (e) {
                    console.error('❌ No se pudo leer el cuerpo del error');
                }
                
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Respuesta JSON procesada:', result);
            return result;
        } catch (error) {
            console.error('❌ Error en petición a Google Apps Script:', error);
            
            // Información adicional para debugging
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                console.error('💡 Posibles causas:');
                console.error('   - URL incorrecta del Google Apps Script');
                console.error('   - Web App no desplegada o sin permisos');
                console.error('   - Problemas de red/CORS');
            }
            
            throw error;
        }
    }

    /**
     * Obtener inventario completo
     */
    async getInventory() {
        try {
            console.log('🔄 Solicitando inventario...');
            console.log('🌐 URL GET:', `${this.webAppUrl}?action=getInventory`);
            
            const response = await fetch(`${this.webAppUrl}?action=getInventory`, {
                method: 'GET',
                // mode: 'cors',
                // redirect: 'follow'
            });

            console.log('📡 Respuesta GET - Status:', response.status);

            if (!response.ok) {
                console.error('❌ Error HTTP en GET:', response.status, response.statusText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Inventario recibido:', result);
            return result;
        } catch (error) {
            console.error('❌ Error obteniendo inventario:', error);
            throw error;
        }
    }

    /**
     * Actualizar stock de un producto
     */
    async updateStock(productId, operation, quantity) {
        const data = {
            action: 'updateStock',
            productId: productId,
            operation: operation, // 'add' o 'subtract'
            quantity: quantity
        };

        return await this.makeRequest(data);
    }
}

// Clase actualizada para manejar el inventario con Google Apps Script
class InventoryManagerGAS {
    constructor() {
        // Verificar que se haya configurado la URL del Web App
        if (typeof APPS_SCRIPT_CONFIG === 'undefined') {
            console.error('❌ APPS_SCRIPT_CONFIG no está definido. Asegúrate de incluir config-gas.js antes que inventory-gas.js');
            alert('⚠️ Error de configuración: Falta el archivo de configuración config-gas.js');
            return;
        }

        if (!APPS_SCRIPT_CONFIG || APPS_SCRIPT_CONFIG.WEB_APP_URL === 'REEMPLAZAR_CON_TU_URL_DE_WEB_APP') {
            console.warn('⚠️ IMPORTANTE: URL de Google Apps Script no configurada correctamente');
            alert('⚠️ Error de configuración: Verifica la URL del Google Apps Script en config-gas.js');
            return;
        }

        this.api = new GoogleSheetsAPI(APPS_SCRIPT_CONFIG.WEB_APP_URL);
        this.initializeEventListeners();
        this.loadInventory();
        
        console.log('🚀 Sistema iniciado con URL:', APPS_SCRIPT_CONFIG.WEB_APP_URL);
    }

    initializeEventListeners() {
        // Botones de compra
        const buyButtons = document.querySelectorAll('.buy-btn');
        console.log(`🔘 Encontrados ${buyButtons.length} botones de compra`);
        
        buyButtons.forEach((button, index) => {
            console.log(`🔘 Configurando botón ${index + 1}:`, {
                productId: button.dataset.productId,
                product: button.dataset.product,
                price: button.dataset.price
            });
            
            button.addEventListener('click', (e) => {
                console.log('🖱️ Click detectado en botón de compra');
                this.handlePurchase(e.target);
            });
        });

        // Botones de navegación
        const explorarBtn = document.getElementById('explorar-btn');
        const catalogoBtn = document.getElementById('catalogo-btn');
        
        if (explorarBtn) {
            explorarBtn.addEventListener('click', () => {
                console.log('🖱️ Click en explorar');
                this.scrollToProducts();
            });
        }

        if (catalogoBtn) {
            catalogoBtn.addEventListener('click', () => {
                console.log('🖱️ Click en catálogo');
                this.scrollToProducts();
            });
        }

        console.log('✅ Event listeners configurados correctamente');
    }

    scrollToProducts() {
        const productosSection = document.getElementById('productos');
        if (productosSection) {
            productosSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Cargar inventario desde Google Sheets
     */
    async loadInventory() {
        try {
            this.showLoading('Cargando inventario...');
            
            const result = await this.api.getInventory();
            
            if (result.success) {
                console.log('✅ Inventario cargado:', result.data);
                this.updateProductDisplay(result.data);
                this.hideLoading();
            } else {
                console.error('❌ Error cargando inventario:', result.message);
                this.showError('Error cargando inventario: ' + result.message);
            }
        } catch (error) {
            console.error('❌ Error conectando con Google Sheets:', error);
            this.showError('Error conectando con el servidor. Usando datos locales.');
            this.hideLoading();
        }
    }

    /**
     * Manejar compra de producto
     */
    async handlePurchase(button) {
        console.log('🛒 Iniciando proceso de compra...');
        
        const productId = parseInt(button.dataset.productId);
        const productName = button.dataset.product;
        const price = button.dataset.price;
        
        console.log('📦 Datos del producto:', {
            productId,
            productName,
            price
        });
        
        if (!productId || !productName || !price) {
            console.error('❌ Información del producto incompleta');
            this.showError('Información del producto incompleta');
            return;
        }

        // Confirmar compra
        const confirmed = confirm(`¿Confirmar compra de ${productName}?\nPrecio: $${price}`);
        if (!confirmed) {
            console.log('❌ Compra cancelada por el usuario');
            return;
        }

        try {
            console.log('🔄 Procesando compra...');
            this.showLoading(`Procesando compra de ${productName}...`);
            button.disabled = true;

            // Restar 1 del stock
            console.log('📡 Enviando petición para actualizar stock...');
            const result = await this.api.updateStock(productId, 'subtract', 1);

            console.log('📨 Respuesta recibida:', result);

            if (result.success) {
                this.showSuccess(`✅ Compra realizada: ${productName}`);
                console.log('📦 Stock actualizado:', result.data);
                
                // Actualizar display del producto
                this.updateProductStock(productId, result.data.newStock);
                
                // Recargar inventario completo para mantener sincronización
                setTimeout(() => this.loadInventory(), 1000);
            } else {
                this.showError(`❌ Error en compra: ${result.message}`);
                if (result.message.includes('Stock insuficiente')) {
                    this.showError(`No hay suficiente stock de ${productName}`);
                }
            }
        } catch (error) {
            console.error('❌ Error procesando compra:', error);
            this.showError('Error procesando la compra. Intenta nuevamente.');
        } finally {
            button.disabled = false;
            this.hideLoading();
        }
    }

    /**
     * Actualizar display de productos con datos del inventario
     */
    updateProductDisplay(inventory) {
        inventory.forEach(product => {
            const productElements = document.querySelectorAll(`[data-product-id="${product.id}"]`);
            productElements.forEach(element => {
                // Actualizar stock en el botón
                if (element.tagName === 'BUTTON') {
                    this.updateProductButton(element, product);
                }
                
                // Actualizar otros elementos si existen
                const stockElement = document.querySelector(`#stock-${product.id}`);
                if (stockElement) {
                    stockElement.textContent = `Stock: ${product.stock_actual}`;
                }
            });
        });
    }

    /**
     * Actualizar botón de producto individual
     */
    updateProductButton(button, product) {
        const isLowStock = product.stock_actual <= product.stock_minimo;
        const isOutOfStock = product.stock_actual <= 0;

        if (isOutOfStock) {
            button.textContent = 'Agotado';
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
        } else if (isLowStock) {
            button.textContent = `Comprar (Quedan ${product.stock_actual})`;
            button.classList.add('bg-yellow-500');
        } else {
            button.textContent = 'Comprar';
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-yellow-500');
        }
    }

    /**
     * Actualizar stock de un producto específico
     */
    updateProductStock(productId, newStock) {
        const buttons = document.querySelectorAll(`[data-product-id="${productId}"]`);
        buttons.forEach(button => {
            if (newStock <= 0) {
                button.textContent = 'Agotado';
                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                button.textContent = `Comprar (Quedan ${newStock})`;
                button.disabled = false;
                button.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
    }

    // Métodos de UI para mostrar estados
    showLoading(message) {
        console.log('🔄 ' + message);
        // Aquí puedes agregar un spinner o indicador visual
    }

    hideLoading() {
        console.log('✅ Carga completada');
        // Aquí puedes ocultar el spinner
    }

    showSuccess(message) {
        console.log('✅ ' + message);
        alert(message); // Puedes reemplazar con una notificación más elegante
    }

    showError(message) {
        console.error('❌ ' + message);
        alert(message); // Puedes reemplazar con una notificación más elegante
    }
}

// Funciones de utilidad para testing y administración
const AdminUtils = {
    /**
     * Agregar stock a un producto (para reposición)
     */
    async addStock(productId, quantity) {
        // Verificar que APPS_SCRIPT_CONFIG esté disponible
        if (typeof APPS_SCRIPT_CONFIG === 'undefined') {
            console.error('❌ APPS_SCRIPT_CONFIG no está definido');
            throw new Error('Configuración no disponible');
        }

        const api = new GoogleSheetsAPI(APPS_SCRIPT_CONFIG.WEB_APP_URL);
        try {
            const result = await api.updateStock(productId, 'add', quantity);
            if (result.success) {
                console.log('✅ Stock agregado:', result.data);
                return result;
            } else {
                console.error('❌ Error agregando stock:', result.message);
                return result;
            }
        } catch (error) {
            console.error('❌ Error:', error);
            throw error;
        }
    },

    /**
     * Ver inventario actual
     */
    async viewInventory() {
        // Verificar que APPS_SCRIPT_CONFIG esté disponible
        if (typeof APPS_SCRIPT_CONFIG === 'undefined') {
            console.error('❌ APPS_SCRIPT_CONFIG no está definido');
            throw new Error('Configuración no disponible');
        }

        const api = new GoogleSheetsAPI(APPS_SCRIPT_CONFIG.WEB_APP_URL);
        try {
            const result = await api.getInventory();
            if (result.success) {
                console.table(result.data);
                return result.data;
            } else {
                console.error('❌ Error obteniendo inventario:', result.message);
                return null;
            }
        } catch (error) {
            console.error('❌ Error:', error);
            throw error;
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que APPS_SCRIPT_CONFIG esté disponible antes de inicializar
    if (typeof APPS_SCRIPT_CONFIG === 'undefined') {
        console.error('❌ APPS_SCRIPT_CONFIG no está definido. Asegúrate de incluir config-gas.js antes que inventory-gas.js');
        alert('⚠️ Error de configuración: Falta el archivo de configuración config-gas.js');
        return;
    }

    window.inventoryManager = new InventoryManagerGAS();
    
    // Hacer AdminUtils disponible globalmente para testing
    window.AdminUtils = AdminUtils;
    
    console.log('🚀 Sistema de inventario con Google Apps Script iniciado');
    console.log('💡 Usa AdminUtils.viewInventory() para ver el inventario actual');
    console.log('💡 Usa AdminUtils.addStock(productId, quantity) para agregar stock');
});
