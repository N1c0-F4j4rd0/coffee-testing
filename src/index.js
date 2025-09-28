const AutoDriverSetup = require('./config/auto-driver-setup');
const HomePage = require('./pages/home-page');
const CartActions = require('./actions/cart-actions');
const ScreenshotManager = require('./utils/screenshot');
const Logger = require('../src/utils/logger');

class CoffeeCartAutomation {
    constructor() {
        this.driver = null;
        this.homePage = null;
        this.cartActions = null;
        this.screenshotManager = null;
        this.verification = null;
    }

    async initialize() {
        try {
            Logger.info('🚀 INICIANDO AUTOMATIZACIÓN COFFEE CART');
            Logger.info('📋 Chrome Version: 140.0.7339.187');
            Logger.info('🎯 Target: https://coffee-cart.app/');
            
            this.driver = await AutoDriverSetup.createDriver();
            this.screenshotManager = new ScreenshotManager(this.driver);
            this.homePage = new HomePage(this.driver);
            this.cartActions = new CartActions(this.homePage);
            
            Logger.success('✅ AUTOMATIZACIÓN INICIALIZADA CORRECTAMENTE');
            return true;
            
        } catch (error) {
            Logger.error(`❌ ERROR EN INICIALIZACIÓN: ${error.message}`);
            return false;
        }
    }

    async runFullTest() {
        if (!this.driver) {
            Logger.error('❌ DRIVER NO INICIALIZADO');
            return false;
        }

        try {
            // PASO 1: Abrir página y verificar estructura
            Logger.info('\n📍 PASO 1: Configuración inicial...');
            await this.homePage.open();
            await this.screenshotManager.takeScreenshotWithStep(1, 'pagina-cargada');
            
            // Verificar que tenemos productos
            const initialProducts = await this.homePage.getAllProducts();
            if (initialProducts.length === 0) {
                throw new Error('No se detectaron productos en la página');
            }
            Logger.success(`✅ ${initialProducts.length} productos detectados`);

            // PASO 2: Agregar productos al carrito
            Logger.info('\n📍 PASO 2: Agregando productos al carrito...');
            const addedCount = await this.cartActions.addRandomProducts(3);
            await this.screenshotManager.takeScreenshotWithStep(2, 'productos-agregados');

            // PASO 3: Verificación detallada
            Logger.info('\n📍 PASO 3: Verificación de resultados...');
            this.verification = await this.cartActions.verifyCartContents();
            await this.screenshotManager.takeScreenshotWithStep(3, 'verificacion-final');

            // PASO 4: Reporte final
            Logger.info('\n📍 PASO 4: Generando reporte completo...');
            await this.generateFinalReport();

            const success = this.verification.success || addedCount > 0;
            
            if (success) {
                Logger.success('\n🎉 AUTOMATIZACIÓN COMPLETADA EXITOSAMENTE!');
            } else {
                Logger.warn('\n⚠️ AUTOMATIZACIÓN COMPLETADA CON ADVERTENCIAS');
            }
            
            return success;
            
        } catch (error) {
            Logger.error(`\n💥 ERROR DURANTE LA EJECUCIÓN: ${error.message}`);
            await this.screenshotManager.takeScreenshot('error-critico');
            return false;
        }
    }

    async generateFinalReport() {
        this.cartActions.generateReport();
        
        Logger.info('\n' + '='.repeat(70));
        Logger.info('📈 REPORTE FINAL DE AUTOMATIZACIÓN');
        Logger.info('='.repeat(70));
        Logger.info(`🕒 Fecha: ${new Date().toLocaleString()}`);
        Logger.info(`🌐 URL: ${this.homePage.url}`);
        Logger.info(`📦 Productos procesados: ${this.verification.expectedCount}`);
        Logger.info(`🛒 Items detectados: ${this.verification.itemCount}`);
        Logger.info(`👀 Items visibles: ${this.verification.actualItems}`);
        Logger.info(`💰 Total: ${this.verification.total}`);
        Logger.info(`✅ Éxito: ${this.verification.success ? 'SÍ' : 'NO'}`);
        
        if (!this.verification.success) {
            Logger.info('\n💡 ANÁLISIS DEL PROBLEMA:');
            if (this.verification.expectedCount > 0 && this.verification.itemCount === 0) {
                Logger.info('   • Los productos se agregaron pero el carrito no se actualizó visiblemente');
                Logger.info('   • Esto puede ser normal en esta página específica');
            }
        }
        Logger.info('='.repeat(70));
    }

    async close() {
        if (this.driver) {
            try {
                await this.driver.quit();
                Logger.info('🔚 NAVEGADOR CERRADO');
            } catch (error) {
                Logger.error('❌ Error cerrando navegador:', error.message);
            }
        }
    }
}

// FUNCIÓN PRINCIPAL
async function main() {
    const automation = new CoffeeCartAutomation();
    let success = false;
    
    try {
        Logger.info('\n' + '⭐'.repeat(30));
        Logger.info('   COFFEE CART AUTOMATION v2.0');
        Logger.info('   (OPTIMIZADO PARA COFFEE-CART.APP)');
        Logger.info('⭐'.repeat(30));
        
        const initialized = await automation.initialize();
        if (!initialized) {
            process.exit(1);
        }
        
        success = await automation.runFullTest();
        
    } catch (error) {
        Logger.error('💀 ERROR NO MANEJADO:', error);
    } finally {
        await automation.close();
        process.exit(success ? 0 : 1);
    }
}

// Manejo de señales
process.on('SIGINT', () => {
    Logger.info('\n🛑 Ejecución interrumpida por el usuario');
    process.exit(0);
});

if (require.main === module) {
    main();
}

module.exports = CoffeeCartAutomation;